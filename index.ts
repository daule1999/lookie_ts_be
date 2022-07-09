import { NextFunction } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { NotFoundError, InternalError, ApiError } from './src/core/ApiError';

import { corsUrl, environment } from './src/config/config'
import app from './App'
const port = process.env.PORT || 3000;
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import './src/database'
import Logger from './src/core/Logger';
import routes from './src/routes'

app.use(helmet());
app.use(compression());


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
process.on('uncaughtException', (e) => {
  Logger.error(e);
});
app.use('/v1', routes);
app.use((req, res, next) => next(new NotFoundError()));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      Logger.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});
app.listen(port, (): void => {
  Logger.info(`Server is listening on port ${port}.`);
  return;
});