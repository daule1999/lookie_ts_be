import express from 'express';
import path from 'path'
class App {

  public express;
  constructor() {
    this.express = express();
    this.mountRoutes();
    this.express.use('/public', express.static(path.join(__dirname, 'public')));
  }
  private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({ message: 'Go away, world!' });
    });
    this.express.use('/', router);
  }
}
export default new App().express;