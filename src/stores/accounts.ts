import { v4 as uuIDV4 } from 'uuid';
import { atom } from 'recoil';

const uuIDAAPK = uuIDV4();
export type Account = {
  name?: string;
  pin?: number;
};
const accountsDefault: { [uuID: string]: Account } = {
  [uuIDAAPK]: {
    name: 'Anthony Koppers',
    pin: 1234,
  },
};
export const accountsState = atom({
  key: 'accounts',
  default: accountsDefault,
});

export const loginState = atom({
  key: 'login',
  default: uuIDAAPK,
});
