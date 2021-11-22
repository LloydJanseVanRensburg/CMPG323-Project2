"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const BaseException_1 = require("../modules/BaseException");
const AuthenticationService_1 = require("../services/AuthenticationService");
const requestValidations_1 = require("../utils/requestValidations");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const db = require('../models');
class AuthControllers {
    static async loggedInUser(req, res, next) {
        try {
            // @ts-ignore
            const { id: userId } = req.user;
            const user = await db.user.findByPk(userId, {
                attributes: { exclude: ['password'] },
            });
            if (!user) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            // Validate Login Request body
            if (!(0, requestValidations_1.validateLoginAuthBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            // Email  and Password Required for login
            let { email, password } = req.body;
            // Login Service
            const data = await AuthenticationService_1.AuthenticationService.login({ email, password });
            // Respond to client login data
            res.status(httpStatusCodes_1.httpStatusCode.OK).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    static async register(req, res, next) {
        try {
            // Validate Request Body
            if (!(0, requestValidations_1.validateRegisterAuthBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            let { email, username, password } = req.body;
            let registerData = {
                email,
                username,
                password,
                profilePicture: 'ea83409a099cfe26db0a435faf362b31',
            };
            // Register Service
            const data = await AuthenticationService_1.AuthenticationService.register(registerData);
            // Respond to client with register data
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json(data);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthControllers = AuthControllers;
