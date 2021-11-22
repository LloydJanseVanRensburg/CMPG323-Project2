"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
class BaseException extends Error {
    isOperational;
    statusCode;
    errorCode;
    constructor(message, statusCode, errorCode) {
        super(message);
        this.isOperational = true;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
    static notFound() {
        return new BaseException('Resource not found', httpStatusCodes_1.httpStatusCode.NOT_FOUND);
    }
    static notAllowed() {
        return new BaseException('Not allowed', httpStatusCodes_1.httpStatusCode.UNAUTHORIZED);
    }
    static notInvited() {
        return new BaseException('No invite found', 404);
    }
    static notFileFound() {
        return new BaseException('No file found, please provide file', httpStatusCodes_1.httpStatusCode.BAD_REQUEST);
    }
    static invalidRequestBody() {
        return new BaseException('Invalid request body', httpStatusCodes_1.httpStatusCode.BAD_REQUEST);
    }
    static invalidCredentials() {
        return new BaseException('Invalid Credentials', httpStatusCodes_1.httpStatusCode.UNAUTHORIZED);
    }
    static invalidToken() {
        return new BaseException('Access denied invalid token', httpStatusCodes_1.httpStatusCode.UNAUTHORIZED);
    }
    static alreadyRegistered() {
        return new BaseException('User already register', httpStatusCodes_1.httpStatusCode.BAD_REQUEST);
    }
    static expiredToken() {
        return new BaseException('Token has expired', httpStatusCodes_1.httpStatusCode.UNAUTHORIZED);
    }
}
exports.BaseException = BaseException;
