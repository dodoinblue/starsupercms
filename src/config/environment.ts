export const environment = process.env.NODE_ENV;
export const isDevMode = Object.is(environment, 'dev');
export const isProdMode = Object.is(environment, 'prod');
export const isTestMode = Object.is(environment, 'test');

export const appEnv = {
  isDevMode,
  isProdMode,
  isTestMode,
  value: environment,
};
