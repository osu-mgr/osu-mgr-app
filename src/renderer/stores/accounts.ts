import { atom } from 'recoil';

export type AccountType = 'account';

export type Account = {
  _docType?: AccountType;
  _uuid?: string;
  name?: string;
  _pin?: string;
  _permissions?: string[];
  _history?: { datetime: string }[];
};

const loginDefault: Account = {};
export const loginState = atom({
  key: 'login',
  default: loginDefault,
});
