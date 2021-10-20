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
}
