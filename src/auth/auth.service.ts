import bcrypt from 'bcrypt';
import lodash from 'lodash';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrCodes } from '../errors/errors';
import { Account } from './entity/account.entity';
import { AUTH } from '../config/configurations';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  async createToken(account: Account) {
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

  async validateEmailLogin(email, password) {
    const accountFromDb = await this.accountRepo.findOne({
      where: { username: email, type: 'email' },
    });
    if (!accountFromDb) {
      throw new HttpException(
        ErrCodes.LOGIN_USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (AUTH.requireVerify && !accountFromDb.verified) {
      throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);
    }

    const isValidPass = await bcrypt.compare(password, accountFromDb.password);

    if (isValidPass) {
      return await this.createToken(accountFromDb);
    } else {
      throw new HttpException(
        ErrCodes.LOGIN_UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async registerByEmail(email: string, password: string) {
    const accountFromDb = await this.accountRepo.findOne({
      where: { username: email, type: 'email' },
    });
    if (accountFromDb) {
      throw new HttpException(ErrCodes.REG_USER_EXIST, HttpStatus.BAD_REQUEST);
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
