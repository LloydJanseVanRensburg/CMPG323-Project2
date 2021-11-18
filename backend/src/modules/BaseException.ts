import { httpStatusCode } from '../constants/httpStatusCodes';

export class BaseException extends Error {
  isOperational: boolean;
  statusCode: number;
  errorCode?: string;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }

  static notFound() {
    return new BaseException('Resource not found', httpStatusCode.NOT_FOUND);
  }

  static notAllowed() {
    return new BaseException('Not allowed', httpStatusCode.UNAUTHORIZED);
  }

  static notInvited() {
    return new BaseException('No invite found', 404);
  }

  static notFileFound() {
    return new BaseException(
      'No file found, please provide file',
      httpStatusCode.BAD_REQUEST
    );
  }

  static invalidRequestBody() {
    return new BaseException(
      'Invalid request body',
      httpStatusCode.BAD_REQUEST
    );
  }

  static invalidCredentials() {
    return new BaseException(
      'Invalid Credentials',
      httpStatusCode.UNAUTHORIZED
    );
  }

  static invalidToken() {
    return new BaseException(
      'Access denied invalid token',
      httpStatusCode.UNAUTHORIZED
    );
  }

  static alreadyRegistered() {
    return new BaseException(
      'User already register',
      httpStatusCode.BAD_REQUEST
    );
  }

  static expiredToken() {
    return new BaseException('Token has expired', httpStatusCode.UNAUTHORIZED);
  }
}
