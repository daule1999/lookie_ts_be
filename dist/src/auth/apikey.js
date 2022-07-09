"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiKeyRepo_1 = __importDefault(require("../database/Repository/ApiKeyRepo"));
const Logger_1 = __importDefault(require("../core/Logger"));
// import schema from './schema';
// import validator, { ValidationSource } from '../helpers/validator';
const asyncHandler_1 = __importDefault(require("../core/asyncHandler"));
const router = express_1.default.Router();
exports.default = router.use(
// validator(schema.apiKey, ValidationSource.HEADER),
(0, asyncHandler_1.default)(async (req, res, next) => {
    // @ts-ignore
    req.apiKey = req.headers['x-api-key'].toString();
    const apiKey = await ApiKeyRepo_1.default.findByKey(req.apiKey);
    // const apiKey = req.apiKey
    Logger_1.default.info(apiKey);
    // if (!apiKey) throw new ForbiddenError();
    return next();
}));
//# sourceMappingURL=apikey.js.map