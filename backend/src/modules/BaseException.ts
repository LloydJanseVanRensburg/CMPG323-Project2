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
