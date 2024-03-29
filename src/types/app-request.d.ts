import { Request } from 'express';
import User from '../database/model/User';
import Keystore from '../database/model/Keystore';

declare interface PublicRequest extends Request {
  apiKey: string;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCode: string;
}

declare interface ProtectedRequest extends RoleRequest {
  user: User;
  accessToken: string;
  keystore: Keystore;
}
declare interface UserRequest extends Request {
  user: User;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
declare interface TokensRequest extends Request {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  keystore?: Keystore;
}


