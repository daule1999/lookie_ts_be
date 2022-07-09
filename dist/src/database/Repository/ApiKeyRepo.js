"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiKey_1 = require("../models/ApiKey");
class ApiRepo {
    static async findByKey(key) {
        return ApiKey_1.ApiKeyModel.findOne({ key: key, status: true }).lean().exec();
    }
}
exports.default = ApiRepo;
//# sourceMappingURL=ApiKeyRepo.js.map