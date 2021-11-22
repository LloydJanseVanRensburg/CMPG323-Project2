"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const BaseException_1 = require("../modules/BaseException");
const db = require('../models');
class UserControllers {
    static async getAll(req, res, next) {
        try {
            const users = await db.user.findAll({
                attributes: {
                    exclude: ['password'],
                },
            });
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: users,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { userId } = req.params;
            const foundUser = await db.user.findByPk(userId, {
                attributes: {
                    exclude: ['password'],
                },
            });
            if (!foundUser) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: foundUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteById(req, res, next) {
        try {
            const { userId } = req.params;
            const foundUser = await db.user.findByPk(userId);
            if (!foundUser) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            await foundUser.destroy();
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                message: 'User deleted',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserControllers = UserControllers;
