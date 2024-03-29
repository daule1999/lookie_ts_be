import express, { NextFunction, Request, Response } from 'express';
import ApiKeyRepo from '../database/Repository/ApiKeyRepo';
import { ForbiddenError } from '../core/ApiError';
import Logger from '../core/Logger';
import { TokensRequest } from 'app-request';
// import schema from './schema';
// import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../core/asyncHandler';

const router = express.Router();

export default router.use(
  // validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: TokensRequest, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.apiKey = req.headers['x-api-key'].toString();

    const apiKey = await ApiKeyRepo.findByKey(req.apiKey);
    // const apiKey = req.apiKey
    Logger.info(apiKey);

    // if (!apiKey) throw new ForbiddenError();
    return next();
  }),
);
