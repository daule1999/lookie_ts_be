"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("./../core/ApiError");
const authUtils_1 = require("./../auth/authUtils");
const ApiError_2 = require("../core/ApiError");
const ApiResponse_1 = require("./../core/ApiResponse");
const lodash_1 = __importDefault(require("lodash"));
const ApiError_3 = require("../core/ApiError");
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const asyncHandler_1 = __importDefault(require("../core/asyncHandler"));
const UserRepo_1 = __importDefault(require("../database/Repository/UserRepo"));
const Logger_1 = __importDefault(require("../core/Logger"));
const crypto_1 = __importDefault(require("crypto"));
const KeystoreRepo_1 = __importDefault(require("../database/Repository/KeystoreRepo"));
const router = express_1.default.Router();
router.post('/signup', (0, asyncHandler_1.default)(async (req, res, next) => {
    const user = await UserRepo_1.default.getUserByEmail(req.body.email);
    if (user)
        throw new ApiError_3.BadRequestError('User already registered');
    const passwordHash = await bcryptjs_1.default.hash(req.body.password, 10);
    const accessTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const { user: createdUser, keystore } = await UserRepo_1.default.addUser({
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
        mobile: req.body.mobile
    }, accessTokenKey, refreshTokenKey);
    const tokens = await (0, authUtils_1.createTokens)(createdUser, keystore.primaryKey, keystore.secondaryKey);
    new ApiResponse_1.SuccessResponse('Signup Successful', {
        user: lodash_1.default.pick(createdUser, ['_id', 'name', 'email', 'profilePicUrl', 'mobile']),
        tokens: tokens
    }).send(res);
}));
router.post('/login', (0, asyncHandler_1.default)(async (req, res, next) => {
    const user = await UserRepo_1.default.getUserByEmail(req.body.user.email);
    if (!user)
        throw new ApiError_3.BadRequestError('User Not registered');
    if (user !== null) {
        const pass = user.password;
        // const passwordHash = await bcrypt.hash(req.body.user.password, 10);
        const isMatch = await UserRepo_1.default.comparePassword(req.body.user.password, pass);
        if (!isMatch)
            throw new ApiError_1.AuthFailureError('Authentication failure');
        const accessTokenKey = crypto_1.default.randomBytes(64).toString('hex');
        const refreshTokenKey = crypto_1.default.randomBytes(64).toString('hex');
        await KeystoreRepo_1.default.create(user._id, accessTokenKey, refreshTokenKey);
        const tokens = await (0, authUtils_1.createTokens)(user, accessTokenKey, refreshTokenKey);
        new ApiResponse_1.SuccessResponse('Login Successful', {
            user,
            tokens: tokens,
        }).send(res);
    }
}));
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
router.post('/changepassword', (0, asyncHandler_1.default)(async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = await UserRepo_1.default.getUserByEmail(req.body.email);
    if (!user) {
        Logger_1.default.info('user Not registered');
        throw new ApiError_3.BadRequestError('User Not registered');
    }
    if (user !== null) {
        const pass = user.password;
        const isMatch = await UserRepo_1.default.comparePassword(req.body.oldPassword, pass);
        if (isMatch) {
            const updatedUser = await UserRepo_1.default.updatePassword(req.body.email, newPassword);
            new ApiResponse_1.SuccessResponse('Login Successful', {
                updatedUser
            }).send(res);
        }
        else {
            Logger_1.default.info('Password doesn,t Match');
            throw new ApiError_3.BadRequestError('Password doesn,t Match');
        }
    }
    else {
        Logger_1.default.info('user Not registered');
        throw new ApiError_2.InternalError('User Not registered');
    }
}));
router.post('/forgotpassword', (0, asyncHandler_1.default)(async (req, res, next) => {
    const user = await UserRepo_1.default.getUserByEmail(req.body.user.email);
    if (!user)
        throw new ApiError_3.BadRequestError('User Not registered');
    if (user !== null) {
        // const msg = formateForMail('forgotPassword', token);
        // nodeMailer(user.email, 'ProjectZeros Password Assistance', msg);
        new ApiResponse_1.SuccessResponse('Mail is sent to the registered mail address', {
            mob: user.mobile
        }).send(res);
    }
}));
router.post('/resetpassword', (0, asyncHandler_1.default)(async (req, res, next) => {
    const user = await UserRepo_1.default.getUserByEmail(req.body.user.email);
    if (!user)
        throw new ApiError_3.BadRequestError('User Not registered');
    if (user !== null) {
        // const msg = formateForMail('forgotPassword', token);
        // nodeMailer(user.email, 'ProjectZeros Password Assistance', msg);
        new ApiResponse_1.SuccessResponse('Mail is sent to the registered mail address', {
            mob: user.mobile
        }).send(res);
    }
}));
router.get('/users/signOut', (0, asyncHandler_1.default)(async (req, res, next) => {
    // const response=await req.logOut();
    res.status(200).clearCookie('token', {
        path: '/'
    });
    // req.session.destroy(function (err) {
    res.redirect('/');
    // });
}));
exports.default = router;
//# sourceMappingURL=user.js.map