"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const BaseException_1 = require("../modules/BaseException");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = require('../models');
class AuthenticationService {
    static login(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.user.findOne({
                    where: { email: data.email },
                });
                if (!user) {
                    return reject(BaseException_1.BaseException.invalidCredentials());
                }
                const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
                if (!isMatch) {
                    return reject(BaseException_1.BaseException.invalidCredentials());
                }
                // Building JWT Token payload
                const payload = {
                    userId: user.id,
                };
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                resolve({
                    success: true,
                    data: {
                        token: token,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            profilePicture: user.profilePicture,
                        },
                    },
                });
            }
            catch (error) {
                if (error.message === 'jwt expires') {
                    reject(BaseException_1.BaseException.expiredToken());
                }
                else {
                    reject(error);
                }
            }
        });
    }
    static register(data) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check user don't exists already
                const foundUser = await db.user.findOne({
                    where: { email: data.email },
                });
                if (foundUser) {
                    return reject(BaseException_1.BaseException.alreadyRegistered());
                }
                // Hash password
                let hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
                // Save  user
                const newUser = await db.user.create({
                    username: data.username,
                    email: data.email,
                    password: hashedPassword,
                    profilePicture: data.profilePicture,
                });
                // Creating and Sign JWT
                const payload = {
                    userId: newUser.id,
                };
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                // Resolve with register data
                resolve({
                    success: true,
                    data: {
                        token: token,
                        user: {
                            id: newUser.id,
                            username: newUser.username,
                            email: newUser.email,
                            profilePicture: newUser.profilePicture,
                        },
                    },
                });
            }
            catch (error) {
                // Reject with Error
                reject(error);
            }
        });
    }
}
exports.AuthenticationService = AuthenticationService;
