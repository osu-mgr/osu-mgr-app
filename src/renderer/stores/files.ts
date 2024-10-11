import { atom } from 'recoil';

export type FilesSearch = {
  searchString: string;
  sortOrder:
    | 'processed asc'
    | 'processed desc'
    | 'modified asc'
    | 'modified desc'
    | 'alpha asc'
    | 'alpha desc';
  tap: number;
};
const filesSearchDefault: FilesSearch = {
  searchString: '',
  sortOrder: 'modified desc',
  tap: 1,
};
export const filesSearchState = atom({
  key: 'files-search',
  default: filesSearchDefault,
});
