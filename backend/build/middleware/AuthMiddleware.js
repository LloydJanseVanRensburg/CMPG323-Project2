"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Custom Error
const BaseException_1 = require("../modules/BaseException");
// Database models
const db = require('../models');
class AuthMiddleware {
    static async auth(req, res, next) {
        if (!req.headers.authorization) {
            next(BaseException_1.BaseException.notAllowed());
            return;
        }
        let token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await db.user.findByPk(decoded.userId);
            // TODO:  More  security  check
            // 1) Banned user
            // 2) Reset password date vs token issued date
            if (!user) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            // @ts-ignore
            req.user = user;
            next();
        }
        catch (error) {
            if (error.message === 'jwt malformed') {
                next(BaseException_1.BaseException.invalidToken());
                return;
            }
            next(error);
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
