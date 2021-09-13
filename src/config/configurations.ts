import packageJSON from '../../package.json';
import { config } from 'dotenv';
config();

export const APP = {
  host: 'localhost',
  port: 3030,
};

export const APP_INFO = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
};

export const TYPEORM_DB = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'dev',
  password: process.env.DB_PASSWORD || 'devpass',
  database: 'cms-dev',
  timezone: 'Z',
};

export const REDIS = {
  host: '127.0.0.1',
  port: 6379,
  password: (process.env.REDIS_PASSWORD || null) as string,
  ttl: null,
  defaultCacheTTL: 60 * 60 * 24,
};

export const EMAIL = {
  nodemailer: {
    host: 'smtp.qq.com',
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  sender: process.env.EMAIL_ACCOUNT,
};

export const AUTH = {
  jwt: {
    secretOrKey: process.env.JWT_SECRET || 'jwtsecret',
    expiresIn: 3600 * 1000,
  },
  saltRounds: 10,
  requireVerify: false,
};

export const FILE_UPLOAD = {
  local: {
    rootPath: `/tmp/${APP_INFO.name}`,
  },
};
