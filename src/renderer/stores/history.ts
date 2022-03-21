import { atom } from 'recoil';

export type History = {
  locations: {
    path: string;
  }[];
  index: number;
  switching: boolean;
};
const historyDefault: History = {
  locations: [{ path: 'Home' }],
  index: 0,
  switching: false,
};
export const historyState = atom({
  key: 'history',
  default: historyDefault,
});
