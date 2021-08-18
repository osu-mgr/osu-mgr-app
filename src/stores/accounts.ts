import { atom } from 'recoil';

export type Account = {
  _docType?: 'account';
  _uuid?: string;
  name?: string;
  _pin?: string;
  _permissions?: string[];
};

const loginDefault: Account = {};
export const loginState = atom({
  key: 'login',
  default: loginDefault,
});
