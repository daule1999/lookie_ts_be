"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const ApiError_1 = require("../../core/ApiError");
const KeystoreRepo_1 = __importDefault(require("./KeystoreRepo"));
// import KeystoreRepo from './KeystoreRepo';
// import Keystore from '../model/Keystore';
class UserRepo {
    // contains critical information of the user
    static getUserById(id) {
        return User_1.UserModel.findOne().exec();
    }
    static getUserByEmail(email) {
        return User_1.UserModel.findOne({ email })
            .select('+email +password')
            .lean()
            .exec();
    }
    static async updatePassword(email, newPassword) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
            return User_1.UserModel.updateOne({ email: email }, { $set: { password: hashedPassword } });
        }
        catch (e) {
            if (e instanceof ApiError_1.InternalError)
                throw new ApiError_1.InternalError(e.message);
            throw e;
        }
    }
    static async addUser(user, accessTokenKey, refreshTokenKey) {
        // const saltRounds = 10;
        // const hashedPassword = await bycrpt.hash(newUser.password, saltRounds);
        // const user = {
        //   ...newUser,
        //   password: hashedPassword
        // }
        const now = new Date();
        user.createdAt = user.updatedAt = now;
        const createdUser = await User_1.UserModel.create(user);
        const keystore = await KeystoreRepo_1.default.create(createdUser._id, accessTokenKey, refreshTokenKey);
        return { user: createdUser.toObject(), keystore };
    }
    static async comparePassword(candidatePassword, hash) {
        const res = await bcryptjs_1.default.compare(candidatePassword, hash);
        return res;
    }
    // public static findById(id: Types.ObjectId): Promise<User | null> {
    //   return UserModel.findOne({ _id: id, status: true })
    //     .select('+email +password +roles')
    //     .populate({
    //       path: 'roles',
    //       match: { status: true },
    //     })
    //     .lean<User>()
    //     .exec();
    // }
    // public static findByEmail(email: string): Promise<User | null> {
    //   return UserModel.findOne({ email: email, status: true })
    //     .select('+email +password +roles')
    //     .populate({
    //       path: 'roles',
    //       match: { status: true },
    //       select: { code: 1 },
    //     })
    //     .lean<User>()
    //     .exec();
    // }
    // public static findProfileById(id: Types.ObjectId): Promise<User | null> {
    //   return UserModel.findOne({ _id: id, status: true })
    //     .select('+roles')
    //     .populate({
    //       path: 'roles',
    //       match: { status: true },
    //       select: { code: 1 },
    //     })
    //     .lean<User>()
    //     .exec();
    // }
    static findPublicProfileById(id) {
        return User_1.UserModel.findOne({ _id: id, status: true }).lean().exec();
    }
    static async create(user, accessTokenKey, refreshTokenKey, roleCode) {
        const now = new Date();
        user.createdAt = user.updatedAt = now;
        const createdUser = await User_1.UserModel.create(user);
        return { user: createdUser.toObject() };
    }
    static async update(user, accessTokenKey, refreshTokenKey) {
        user.updatedAt = new Date();
        await User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec();
        return { user: user };
    }
    static updateInfo(user) {
        user.updatedAt = new Date();
        return User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec();
    }
}
exports.default = UserRepo;
//# sourceMappingURL=UserRepo.js.map