import bcrypt from 'bcrypt';
import lodash from 'lodash';
import jwt from 'jsonwebtoken';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomError, ErrCodes } from '../../errors/errors';
import { Account } from './entity/account.entity';
import { AUTH } from '../../config/configurations';
import { AccountVerifyToken } from './entity/account-verify-token.entity';
import { randomNumberString } from '../../utils/nanoid';
import dayjs from 'dayjs';
import { AccountTokenPurpose, AccountType } from './auth.interface';
import { JwtPayload, JwtSigned } from './interface/auth.interface';
import { BasicQuery } from '../../common/dto/query-options.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,

    @InjectRepository(AccountVerifyToken)
    private verifyTokenRepo: Repository<AccountVerifyToken>,
  ) {}

  async createAuthTokenFromAccount(account: Partial<Account>): Promise<JwtSigned> {
    const payload: JwtPayload = {
      sub: account.id,
      username: account.username,
    };
    const roleToAccounts = account.roleToAccounts;
    if (roleToAccounts && roleToAccounts.length > 0) {
      payload.roles = roleToAccounts.map((r2a) => r2a.role.key);
    }
    return this.createAuthTokenFromPayload(payload);
  }

  async createAuthTokenFromPayload(payload: JwtPayload) {
    const expiresIn = AUTH.jwt.expiresIn;
    const secretOrKey = AUTH.jwt.secretOrKey;
    const token = jwt.sign(payload, secretOrKey, { expiresIn });
    return {
      expiresIn: expiresIn,
      accessToken: token,
      ...payload,
    };
  }

  async createAccountVerifyToken(
    type: AccountType,
    username: string,
    purpose: AccountTokenPurpose,
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
      purpose,
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
        purpose,
        token,
      });
      await this.verifyTokenRepo.save(verification);
      return token;
    }
  }

  async verifyEmail(email: string, token: string) {
    const verifyTokenRecord = await this.verifyTokenRepo.findOne({
      type: AccountType.Email,
      username: email,
      purpose: AccountTokenPurpose.Verify,
    });
    if (verifyTokenRecord && verifyTokenRecord.token) {
      if (dayjs().diff(dayjs(verifyTokenRecord.updatedAt), 'h') >= 24) {
        await this.verifyTokenRepo.delete(verifyTokenRecord.id);
        throw new CustomError(ErrCodes.AUTH_CODE_EXPIRED, 'Verification code expires after 1 day');
      }

      if (token === verifyTokenRecord.token) {
        await this.accountRepo.update(
          { type: AccountType.Email, username: email },
          { verified: true },
        );
        await this.verifyTokenRepo.delete(verifyTokenRecord.id);
        return;
      }
    }
    throw new CustomError(ErrCodes.AUTH_CODE_NOT_VALID, 'Wrong code', HttpStatus.BAD_REQUEST);
  }

  async validateEmailLogin(email, password) {
    const accountFromDb = await this.accountRepo.findOne({
      where: {
        username: email,
        type: AccountType.Email,
      },
      relations: ['roleToAccounts', 'roleToAccounts.role'],
      select: ['id', 'username', 'type', 'password', 'verified', 'status', 'roleToAccounts'],
    });

    if (!accountFromDb) {
      throw new CustomError(
        ErrCodes.AUTH_USER_NOT_FOUND,
        'User not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (AUTH.requireVerify && !accountFromDb.verified) {
      throw new CustomError(
        ErrCodes.AUTH_EMAIL_NOT_VERIFIED,
        'User not verified.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValidPass = await bcrypt.compare(password, accountFromDb.password);

    if (isValidPass) {
      return await this.createAuthTokenFromAccount(accountFromDb);
    } else {
      throw new CustomError(
        ErrCodes.AUTH_WRONG_CREDENTIAL,
        'Wrong credential',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async registerByEmail(email: string, password: string) {
    const accountFromDb = await this.accountRepo.findOne({
      username: email,
      type: AccountType.Email,
    });
    if (accountFromDb) {
      throw new CustomError(
        ErrCodes.AUTH_REG_USER_EXIST,
        'User already exist',
        HttpStatus.CONFLICT,
      );
    } else {
      const hashed = await bcrypt.hash(password, AUTH.saltRounds);
      const account = this.accountRepo.create({
        username: email,
        type: AccountType.Email,
        password: hashed,
      });
      const createdAccount = await this.accountRepo.save(account);
      return lodash.omit(createdAccount, 'password');
    }
  }

  async resetPasswordByEmailToken(email: string, token: string, password: string) {
    const resetTokenRecord = await this.verifyTokenRepo.findOne({
      type: AccountType.Email,
      username: email,
      purpose: AccountTokenPurpose.Reset,
    });
    if (resetTokenRecord && resetTokenRecord.token) {
      if (dayjs().diff(dayjs(resetTokenRecord.updatedAt), 'h') >= 1) {
        await this.verifyTokenRepo.delete(resetTokenRecord.id);
        throw new CustomError(ErrCodes.AUTH_CODE_EXPIRED, 'Verification code expires after 1 hour');
      }

      if (token === resetTokenRecord.token) {
        const hashed = await bcrypt.hash(password, AUTH.saltRounds);
        await this.accountRepo.update(
          { type: AccountType.Email, username: email },
          { password: hashed },
        );
        await this.verifyTokenRepo.delete(resetTokenRecord.id);
        return;
      }
    }
    throw new CustomError(ErrCodes.AUTH_CODE_NOT_VALID, 'Wrong code', HttpStatus.BAD_REQUEST);
  }
}
