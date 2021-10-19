"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorHandler_1 = require("../modules/ErrorHandler");
function apiErrorHandler(error, req, res, next) {
    var _a;
    if (ErrorHandler_1.ErrorHandler.isTrustedError(error)) {
        res.status(error.statusCode).json({
            msg: error.message,
            code: (_a = error.errorCode) !== null && _a !== void 0 ? _a : '',
        });
        return;
    }
    process.on('unhandledRejection', function (reason, promise) {
        console.log('Unhandled Rejection at:', reason);
    });
    process.on('uncaughtException', function (error) {
        process.exit(1);
    });
    ErrorHandler_1.ErrorHandler.fatale(error, res, next);
}
exports.default = apiErrorHandler;
