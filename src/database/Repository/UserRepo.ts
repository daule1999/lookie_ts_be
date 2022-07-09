
import bycrpt from 'bcryptjs';
import User, { UserModel } from '../models/User';
import { Types } from 'mongoose';
import { ApiError, InternalError } from '../../core/ApiError';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../models/Keystore';
// import KeystoreRepo from './KeystoreRepo';
// import Keystore from '../model/Keystore';

export default class UserRepo {
  // contains critical information of the user
  public static getUserById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne().exec();
  }
  public static getUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email })
      .select('+email +password')
      .lean<User>()
      .exec();
  }
  public static async updatePassword(email: string, newPassword: string): Promise<User | null> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bycrpt.hash(newPassword, saltRounds)
      return UserModel.updateOne({ email: email }, { $set: { password: hashedPassword } }) as unknown as Promise<User | null>;
    } catch (e) {
      if (e instanceof InternalError) throw new InternalError(e.message);
      throw e;
    }
  }
  public static async addUser(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string
  ): Promise<{ user: User; keystore: Keystore }> {
    // const saltRounds = 10;
    // const hashedPassword = await bycrpt.hash(newUser.password, saltRounds);
    // const user = {
    //   ...newUser,
    //   password: hashedPassword
    // }
    const now = new Date();
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
    return { user: createdUser.toObject(), keystore };

  }
  public static async comparePassword(candidatePassword: string, hash: string) {
    const res = await bycrpt.compare(candidatePassword, hash)
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

  public static findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }).lean<User>().exec();
  }

  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; }> {
    const now = new Date();
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    return { user: createdUser.toObject() };
  }

  public static async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    return { user: user };
  }

  public static updateInfo(user: User): Promise<any> {
    user.updatedAt = new Date();
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
  }
}
