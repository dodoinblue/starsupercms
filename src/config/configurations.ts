// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require('../../package.json');

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
};

export const REDIS = {
  host: '127.0.0.1',
  port: 6379,
  password: (process.env.REDIS_PASSWORD || null) as string,
  ttl: null,
  defaultCacheTTL: 60 * 60 * 24,
};
