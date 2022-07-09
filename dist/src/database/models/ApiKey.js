"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'ApiKey';
exports.COLLECTION_NAME = 'api_keys';
const schema = new mongoose_1.Schema({
    key: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        unique: true,
        maxlength: 1024,
    },
    version: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
        min: 1,
        max: 100,
    },
    metadata: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    status: {
        type: mongoose_1.Schema.Types.Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: Date,
        required: true,
        select: false,
    },
}, {
    versionKey: false,
});
exports.ApiKeyModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=ApiKey.js.map