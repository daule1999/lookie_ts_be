"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
class App {
    constructor() {
        this.express = (0, express_1.default)();
        this.mountRoutes();
        this.express.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
    }
    mountRoutes() {
        const router = express_1.default.Router();
        router.get('/', (req, res) => {
            res.json({ message: 'Go away, world!' });
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map