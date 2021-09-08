import bcrypt from 'bcrypt';
import lodash from 'lodash';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomError, ErrCodes } from '../errors/errors';
import { Account } from './entity/account.entity';
import { AUTH } from '../config/configurations';
import { AccountVerifyToken } from './entity/account-verify-token.entity';
import { randomNumberString } from '../utils/nanoid';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,

    @InjectRepository(AccountVerifyToken)
    private verifyTokenRepo: Repository<AccountVerifyToken>,
  ) {}

  async createAuthToken(account: Account) {
    const expiresIn = AUTH.jwt.expiresIn;
    const secretOrKey = AUTH.jwt.secretOrKey;
    const payload = lodash.pick(account, ['id', 'type', 'username', 'roles']);
    const token = jwt.sign(payload, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
      ...payload,
    };
  }

  async createAccountVerifyToken(
    type: string,
    username: string,
    options?: {
      skipAccountCheck: boolean;
    },
  ) {
    if (!options?.skipAccountCheck) {
      const account = await this.accountRepo.findOne({
        type,
        username,
      });
      if (!account) {
        throw new CustomError(
          ErrCodes.AUTH_USER_NOT_FOUND,
          'User not found',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const verificationRecord = await this.verifyTokenRepo.findOne({
      type,
      username,
    });
    const token = randomNumberString(6);
    if (verificationRecord) {
      if (dayjs().diff(dayjs(verificationRecord.updatedAt), 'm') < 5) {
        throw new CustomError(
          ErrCodes.EMAIL_SENT_RECENTLY,
          'Wait 5 min to send email again.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.verifyTokenRepo.update(verificationRecord.id, {
          token,
        });
        return token;
      }
    } else {
      const verification = await this.verifyTokenRepo.create({
        type,
        username,
        token,
      });
      await this.verifyTokenRepo.save(verification);
      return token;
    }
  }

  async verifyEmail(email: string, token: string) {
    const verifyTokenRecord = await this.verifyTokenRepo.findOne({
      type: 'email',
      username: email,
    });
    if (verifyTokenRecord && verifyTokenRecord.token) {
      if (dayjs().diff(dayjs(verifyTokenRecord.updatedAt), 'h') >= 24) {
        await this.verifyTokenRepo.delete(verifyTokenRecord.id);
        throw new CustomError(ErrCodes.AUTH_CODE_EXPIRED, 'Verification code expires after 1 day');
      }

      if (token === verifyTokenRecord.token) {
        await this.accountRepo.update({ type: 'email', username: email }, { verified: true });
        return;
      }
    }
    throw new CustomError(ErrCodes.AUTH_CODE_NOT_VALID, 'Wrong code', HttpStatus.BAD_REQUEST);
  }

  async validateEmailLogin(email, password) {
    const accountFromDb = await this.accountRepo.findOne({
      where: { username: email, type: 'email' },
    });
    if (!accountFromDb) {
      throw new HttpException(ErrCodes.AUTH_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (AUTH.requireVerify && !accountFromDb.verified) {
      throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);
    }

    const isValidPass = await bcrypt.compare(password, accountFromDb.password);

    if (isValidPass) {
      return await this.createAuthToken(accountFromDb);
    } else {
      throw new HttpException(ErrCodes.AUTH_UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  }

  async registerByEmail(email: string, password: string) {
    const accountFromDb = await this.accountRepo.findOne({
      where: { username: email, type: 'email' },
    });
    if (accountFromDb) {
      throw new HttpException(ErrCodes.AUTH_REG_USER_EXIST, HttpStatus.BAD_REQUEST);
    } else {
      const hashed = await bcrypt.hash(password, AUTH.saltRounds);
      const account = this.accountRepo.create({
        username: email,
        type: 'email',
        password: hashed,
      });
      return await this.accountRepo.save(account);
    }
  }
}
