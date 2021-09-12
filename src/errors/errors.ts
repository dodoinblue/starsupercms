import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrCodes {
  UNEXPECTED = 'UNEXPECTED',
  // Auth
  AUTH_USER_NOT_FOUND = 'AUTH.USER_NOT_FOUND',
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH.EMAIL_NOT_VERIFIED',
  AUTH_UNAUTHORIZED = 'AUTH.UNAUTHORIZED',
  AUTH_WRONG_CREDENTIAL = 'AUTH_WRONG_CREDENTIAL',
  AUTH_REG_USER_EXIST = 'AUTH.USER_ALREADY_REGISTERED',
  AUTH_CODE_NOT_VALID = 'AUTH.CODE_NOT_VALID',
  AUTH_CODE_EXPIRED = 'AUTH.CODE_EXPIRED',
  EMAIL_SENT_RECENTLY = 'EMAIL_SENT_RECENTLY',

  // Generic
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
}

export class CustomError extends HttpException {
  constructor(name: string, message: string, statusCode?: HttpStatus) {
    super(message, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = name;
  }
}
