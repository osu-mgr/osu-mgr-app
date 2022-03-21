import { atom } from 'recoil';

export type LocationsSearch = {
  searchString: string;
  hideEmpty: boolean;
  sortOrder:
    | 'ids asc'
    | 'ids desc'
    | 'modified asc'
    | 'modified desc'
    | 'alpha asc'
    | 'alpha desc';
  filter?: 'recent' | 'valid' | 'warning' | 'error';
  view?: 'locations' | 'items' | 'map';
  tap: number;
};
const locationsSearchDefault: LocationsSearch = {
  searchString: '',
  hideEmpty: false,
  sortOrder: 'ids asc',
  view: 'locations',
  tap: 1,
};
export const locationsSearchState = atom({
  key: 'search',
  default: locationsSearchDefault,
});
