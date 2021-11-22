"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = require("../modules/ErrorHandler");
function apiErrorHandler(error, req, res, next) {
    if (ErrorHandler_1.ErrorHandler.isTrustedError(error)) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }
    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection at:', reason);
    });
    process.on('uncaughtException', (error) => {
        process.exit(1);
    });
    ErrorHandler_1.ErrorHandler.fatale(error, res, next);
}
exports.default = apiErrorHandler;
