import { customAlphabet } from 'nanoid';
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const nanoid = (length: number) => customAlphabet(alphabet, length)();
export const randomNumberString = (length = 6) =>
  customAlphabet('0123456789', length)();
