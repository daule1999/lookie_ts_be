"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("./src/core/ApiError");
const config_1 = require("./src/config/config");
const App_1 = __importDefault(require("./App"));
const port = process.env.PORT || 3000;
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
require("./src/database");
const Logger_1 = __importDefault(require("./src/core/Logger"));
const routes_1 = __importDefault(require("./src/routes"));
App_1.default.use((0, helmet_1.default)());
App_1.default.use((0, compression_1.default)());
App_1.default.use(body_parser_1.default.json({ limit: '10mb' }));
App_1.default.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
App_1.default.use((0, cors_1.default)({ origin: config_1.corsUrl, optionsSuccessStatus: 200 }));
process.on('uncaughtException', (e) => {
    Logger_1.default.error(e);
});
App_1.default.use('/v1', routes_1.default);
App_1.default.use((req, res, next) => next(new ApiError_1.NotFoundError()));
App_1.default.use((err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        ApiError_1.ApiError.handle(err, res);
    }
    else {
        if (config_1.environment === 'development') {
            Logger_1.default.error(err);
            return res.status(500).send(err.message);
        }
        ApiError_1.ApiError.handle(new ApiError_1.InternalError(), res);
    }
});
App_1.default.listen(port, () => {
    Logger_1.default.info(`Server is listening on port ${port}.`);
    return;
});
//# sourceMappingURL=index.js.map