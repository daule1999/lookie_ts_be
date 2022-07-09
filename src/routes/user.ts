import { AuthFailureError } from './../core/ApiError';
import { createTokens } from './../auth/authUtils';
import { InternalError } from '../core/ApiError'
import { NextFunction, Response, Request } from 'express';
import { SuccessResponse, SuccessMsgResponse } from './../core/ApiResponse';
import _ from 'lodash';
import { BadRequestError } from '../core/ApiError'
import express from 'express'
import bcrypt from 'bcryptjs';
import asyncHandler from '../core/asyncHandler';
import UserRepo from '../database/Repository/UserRepo';
import { UserRequest, ProtectedRequest, TokensRequest } from '../types/app-request';
import User from '../database/models/User';
import Logger from '../core/Logger';
import crypto from 'crypto'
import KeystoreRepo from '../database/Repository/KeystoreRepo';

const router = express.Router();

router.post('/signup',
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = await UserRepo.getUserByEmail(req.body.email);
    if (user)
      throw new BadRequestError('User already registered');
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const { user: createdUser, keystore } = await UserRepo.addUser(
      {
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
        mobile: req.body.mobile
      } as User,
      accessTokenKey,
      refreshTokenKey,
    );
    const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
    new SuccessResponse('Signup Successful', {
      user: _.pick(createdUser, ['_id', 'name', 'email', 'profilePicUrl', 'mobile']),
      tokens: tokens
    }).send(res);
  })
);

router.post('/login',
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const user: User = <User>await UserRepo.getUserByEmail(req.body.user.email);
      if (!user)
        throw new BadRequestError('User Not registered');
      if (user !== null) {
        const pass: string = user.password
        // const passwordHash = await bcrypt.hash(req.body.user.password, 10);
        const isMatch = await UserRepo.comparePassword(req.body.user.password, pass)
        if (!isMatch) throw new AuthFailureError('Authentication failure');
        const accessTokenKey = crypto.randomBytes(64).toString('hex');
        const refreshTokenKey = crypto.randomBytes(64).toString('hex');

        await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
        const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
        new SuccessResponse('Login Successful', {
          user,
          tokens: tokens,
        }).send(res);
      }
    })
);
// router.get('/users/verify', auth.isAuthenticated, (req, res) => {
//   res.send("Successfully verified");
// })
// router.get('/users/profile', auth.isAuthenticated, (req, res) => {
//   console.log(req)
//   res.json({
//       name: req.name,
//       userName: req.userName,
//       email: req.email,
//       mobile: req.mobile
//   });
// });

router.post('/changepassword',
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const user: User = <User>await UserRepo.getUserByEmail(req.body.email);
      if (!user) {
        Logger.info('user Not registered')
        throw new BadRequestError('User Not registered');
      }
      if (user !== null) {
        const pass: string = user.password;
        const isMatch = await UserRepo.comparePassword(req.body.oldPassword, pass)
        if (isMatch) {
          const updatedUser = await UserRepo.updatePassword(req.body.email, newPassword);
          new SuccessResponse('Login Successful', {
            updatedUser
          }).send(res);
        } else {
          Logger.info('Password doesn,t Match')
          throw new BadRequestError('Password doesn,t Match');
        }
      } else {
        Logger.info('user Not registered')
        throw new InternalError('User Not registered');
      }
    }
  )
);

router.post('/forgotpassword',
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const user: User = <User>await UserRepo.getUserByEmail(req.body.user.email);
      if (!user)
        throw new BadRequestError('User Not registered');
      if (user !== null) {
        // const msg = formateForMail('forgotPassword', token);
        // nodeMailer(user.email, 'ProjectZeros Password Assistance', msg);
        new SuccessResponse('Mail is sent to the registered mail address', {
          mob: user.mobile
        }).send(res);
      }
    }
  )
);
router.post('/resetpassword',
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const user: User = <User>await UserRepo.getUserByEmail(req.body.user.email);
      if (!user)
        throw new BadRequestError('User Not registered');
      if (user !== null) {
        // const msg = formateForMail('forgotPassword', token);
        // nodeMailer(user.email, 'ProjectZeros Password Assistance', msg);
        new SuccessResponse('Mail is sent to the registered mail address', {
          mob: user.mobile
        }).send(res);
      }
    }
  )
);

router.get('/users/signOut', asyncHandler(
  async (req: TokensRequest, res: Response, next: NextFunction): Promise<any> => {
    // const response=await req.logOut();
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse('Logout success').send(res);
  })
);

export default router;