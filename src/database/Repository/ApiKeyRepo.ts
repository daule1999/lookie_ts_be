import ApiKey, { ApiKeyModel } from '../models/ApiKey';

export default class ApiRepo {
  public static async findByKey(key: string): Promise<ApiKey | null> {
    return ApiKeyModel.findOne({ key: key, status: true }).lean<ApiKey>().exec();
  }
}
