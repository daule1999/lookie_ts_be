"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keystore_1 = require("../models/Keystore");
class KeystoreRepo {
    static findforKey(client, key) {
        return Keystore_1.KeystoreModel.findOne({ client: client, primaryKey: key, status: true }).exec();
    }
    static remove(id) {
        return Keystore_1.KeystoreModel.findByIdAndRemove(id).lean().exec();
    }
    static getToken() {
        const token = Keystore_1.KeystoreModel.find();
        return token;
    }
    static createToken() {
        const token = Keystore_1.KeystoreModel.create();
        return token;
    }
    static find(client, primaryKey, secondaryKey) {
        return Keystore_1.KeystoreModel.findOne({
            client: client,
            primaryKey: primaryKey,
            secondaryKey: secondaryKey,
        })
            .lean()
            .exec();
    }
    static async create(client, primaryKey, secondaryKey) {
        const now = new Date();
        const keystore = await Keystore_1.KeystoreModel.create({
            client: client,
            primaryKey: primaryKey,
            secondaryKey: secondaryKey,
            createdAt: now,
            updatedAt: now,
        });
        return keystore.toObject();
    }
}
exports.default = KeystoreRepo;
//# sourceMappingURL=KeystoreRepo.js.map