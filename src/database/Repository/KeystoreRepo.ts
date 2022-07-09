import Keystore, { KeystoreModel } from '../models/Keystore';
import { Types } from 'mongoose';
import User from '../models/User';

export default class KeystoreRepo {
  public static findforKey(client: User, key: string): Promise<Keystore | null> {
    return KeystoreModel.findOne({ client: client, primaryKey: key, status: true }).exec();
  }

  public static remove(id: Types.ObjectId): Promise<Keystore | null> {
    return KeystoreModel.findByIdAndRemove(id).lean<Keystore>().exec();
  }
  public static getToken() {
    const token = KeystoreModel.find();
    return token;
  }
  public static createToken() {
    const token = KeystoreModel.create();
    return token;
  }

  public static find(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    return KeystoreModel.findOne({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    })
      .lean<Keystore>()
      .exec();
  }

  public static async create(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore> {
    const now = new Date();
    const keystore = await KeystoreModel.create({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
      createdAt: now,
      updatedAt: now,
    } as Keystore);
    return keystore.toObject();
  }
}
