"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import apikey from '../auth/apikey';
const express_1 = __importDefault(require("express"));
// import Logger from '../core/Logger';
const user_1 = __importDefault(require("./user"));
const router = express_1.default.Router();
/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
// router.use('/', apikey);
// router.use('/', (req, res, next) => {
//   Logger.info('v1 routes working')
//   res.send('v1 routes working')
// })
/*-------------------------------------------------------------------------*/
// router.get('/', (req, res, next) => {
//   Logger.info('router working///')
//   res.send('router working///')
// })
// router.get('/getToken', apikey)
router.use('/users', user_1.default);
// router.use('/signup', signup);
exports.default = router;
//# sourceMappingURL=index.js.map