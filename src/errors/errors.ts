import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrCodes {
  UNEXPECTED = 'UNEXPECTED',
  // Login
  LOGIN_USER_NOT_FOUND = 'LOGIN.USER_NOT_FOUND',
  LOGIN_EMAIL_NOT_VERIFIED = 'LOGIN.EMAIL_NOT_VERIFIED',
  LOGIN_UNAUTHORIZED = 'LOGIN.UNAUTHORIZED',
  REG_USER_EXIST = 'REGISTRATION.USER_ALREADY_REGISTERED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class CustomError extends HttpException {
  constructor(name: string, message: string, statusCode?: HttpStatus) {
    super(message, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = name;
  }
}
