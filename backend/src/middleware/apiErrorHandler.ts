import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ErrorHandler } from '../modules/ErrorHandler';

function apiErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (ErrorHandler.isTrustedError(error)) {
    res.status(error.statusCode).json({
      msg: error.message,
      code: error.errorCode ?? '',
    });

    return;
  }

  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason);
  });

  process.on('uncaughtException', (error) => {
    process.exit(1);
  });

  ErrorHandler.fatale(error, res, next);
}

export default apiErrorHandler;
