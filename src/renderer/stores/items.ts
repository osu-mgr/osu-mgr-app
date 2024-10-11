import { Diff } from 'deep-diff';
import { atom } from 'recoil';
import { SemanticICONS } from 'semantic-ui-react';

export type ItemsSearch = {
  searchString: string;
  sortOrder:
    | 'ids asc'
    | 'ids desc'
    | 'modified asc'
    | 'modified desc'
    | 'alpha asc'
    | 'alpha desc';
  filter?: 'recent' | 'valid' | 'warning' | 'error';
  tap: number;
};
const itemsSearchDefault: ItemsSearch = {
  searchString: '',
  sortOrder: 'ids asc',
  tap: 1,
};
export const itemsSearchState = atom({
  key: 'items-search',
  default: itemsSearchDefault,
});

export const itemTypes = [
  'cruise',
  'core',
  'section',
  'sectionHalf',
  'sectionSample',
  'dive',
  'diveSample',
  'diveSubsample',
];

export type ItemType = (typeof itemTypes)[number];

export const itemTypesSingular: Record<ItemType, string> = {
  cruise: 'Cruise/Program',
  core: 'Core',
  section: 'Section',
  sectionHalf: 'Section Half',
  sectionSample: 'Section Sample',
  dive: 'Dive',
  diveSample: 'Dive Sample',
  diveSubsample: 'Dive Subsample',
};

export const itemTypesPlural: Record<ItemType, string> = {
  cruise: 'Cruises/Programs',
  core: 'Cores',
  section: 'Sections',
  sectionHalf: 'Section Halves',
  sectionSample: 'Section Samples',
  dive: 'Dives',
  diveSample: 'Dive Samples',
  diveSubsample: 'Dive Subsamples',
};

export const itemTypesHierarchy: Record<ItemType, ItemType[]> = {
  cruise: ['core', 'dive'],
  core: ['section'],
  section: ['sectionHalf'],
  sectionHalf: ['sectionSample'],
  sectionSample: [],
  dive: ['diveSample'],
  diveSample: ['diveSubsample'],
  diveSubsample: [],
};

export const itemTypesIcon: Record<ItemType, SemanticICONS> = {
  cruise: 'ship',
  core: 'circle',
  section: 'toggle off',
  sectionHalf: 'unlinkify',
  sectionSample: 'cube',
  dive: 'shopping basket',
  diveSample: 'cube',
  diveSubsample: 'cubes',
};

interface ItemHistory {
  login: string;
  datetime: string;
  action: 'insert' | 'update' | 'delete';
}

interface ItemMetadata {
  _uuid: string;
  _osuid: string;
  _cruiseUUID?: string;
  _coreUUID?: string;
  _sectionUUID?: string;
  _sectionHalfUUID?: string;
  _sectionSampleUUID?: string;
  _diveUUID?: string;
  _diveSampleUUID?: string;
  _diveSubsampleUUID?: string;
  _cruiseID?: string;
  _coreNumber?: number;
  _sectionNumber?: number;
  _diveNumber?: number;
  _diveSampleNumber?: number;
  _errors?: string[];
  _warnings?: string[];
  igsn?: string;
  notes?: string;
}
export interface CruiseData {
  id?: string;
  name?: string;
  rvName?: string;
  pi?: string;
  piInstitution?: string;
  piEmail?: string;
  collection?: 'mgg' | 'noaa' | 'acc';
  r2rCruiseID?: string;
}

export interface CruiseHistory extends ItemHistory {
  snapshot?: CruiseData;
  diff?: Diff<CruiseData, CruiseData>[];
}
export interface Cruise extends ItemMetadata, CruiseData {
  _docType: 'cruise';
  _modified?: string;
  _validated?: string;
  _history: CruiseHistory[];
}
const cruisesDefault: { [uuID: string]: Cruise } = {};
export const cruisesState = atom({
  key: 'cruises',
  default: cruisesDefault,
});
export const modifiedCruisesState = atom({
  key: 'modified cruises',
  default: cruisesDefault,
});

interface DeploymentData {
  id?: string;
  cruise?: string;
  material?: string;
  method?: string;
  area?: string;
  place?: string;
}

export interface CoreData extends DeploymentData {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  latitudeStart?: string;
  latitudeEnd?: string;
  longitudeStart?: string;
  longitudeEnd?: string;
  waterDepthStart?: string;
  waterDepthEnd?: string;
  diameter?: string;
  length?: string;
  nSections?: string;
}
export interface CoreHistory extends ItemHistory {
  snapshot?: CoreData;
  diff?: Diff<CoreData, CoreData>[];
}
export interface Core extends ItemMetadata, CoreData {
  _docType: 'core';
  _modified?: string;
  _validated?: string;
  _history: CoreHistory[];
}
const coresDefault: { [uuID: string]: Core } = {};
export const coresState = atom({
  key: 'cores',
  default: coresDefault,
});
export const modifiedCoresState = atom({
  key: 'modified cores',
  default: coresDefault,
});
export interface SectionData {
  id?: string;
  core?: string;
  alternateName?: string;
  depthTop?: string;
  depthBottom?: string;
}
export interface SectionHistory extends ItemHistory {
  snapshot?: SectionData;
  diff?: Diff<SectionData, SectionData>[];
}
export interface Section extends ItemMetadata, SectionData {
  _docType: 'section';
  _modified?: string;
  _validated?: string;
  _history: SectionHistory[];
}
const sectionsDefault: { [uuID: string]: Section } = {};
export const sectionsState = atom({
  key: 'sections',
  default: sectionsDefault,
});
export const modifiedSectionsState = atom({
  key: 'modified sections',
  default: sectionsDefault,
});

export interface SectionHalfData {
  section?: string;
  type?: string;
  storageLocation?: string;
  weight?: string;
}
export interface SectionHalfHistory extends ItemHistory {
  snapshot?: SectionHalfData;
  diff?: Diff<SectionHalfData, SectionHalfData>[];
}
export interface SectionHalf extends ItemMetadata, SectionHalfData {
  _docType: 'sectionHalf';
  _modified?: string;
  _validated?: string;
  _history: SectionHalfHistory[];
}
const sectionHalvesDefault: { [uuID: string]: SectionHalf } = {};
export const sectionHalvesState = atom({
  key: 'section halves',
  default: sectionHalvesDefault,
});
export const modifiedSectionHalvesState = atom({
  key: 'modified section halves',
  default: sectionHalvesDefault,
});

export interface SectionSampleData {
  id?: string;
  sectionHalf?: string;
  pi?: string;
  piInstitution?: string;
  piEmail?: string;
}
export interface SectionSampleHistory extends ItemHistory {
  snapshot?: SectionSampleData;
  diff?: Diff<SectionSampleData, SectionSampleData>[];
}
export interface SectionSample extends ItemMetadata, SectionSampleData {
  _docType: 'sectionSample';
  _modified?: string;
  _validated?: string;
  _history: SectionSampleHistory[];
}
const sectionSamplesDefault: { [uuID: string]: SectionSample } = {};
export const sectionSamplesState = atom({
  key: 'section samples',
  default: sectionSamplesDefault,
});
export const modifiedSectionSamplesState = atom({
  key: 'modified section samples',
  default: sectionSamplesDefault,
});

export interface DiveData extends DeploymentData {
  cruise?: string;
  rov?: string;
  weight?: string;
}
export interface DiveHistory extends ItemHistory {
  snapshot?: DiveData;
  diff?: Diff<DiveData, DiveData>[];
}
export interface Dive extends ItemMetadata, DiveData {
  _docType: 'dive';
  _modified?: string;
  _validated?: string;
  _history: DiveHistory[];
}
const divesDefault: { [uuID: string]: Dive } = {};
export const divesState = atom({
  key: 'dives',
  default: divesDefault,
});
export const modifiedDivesState = atom({
  key: 'modified dives',
  default: divesDefault,
});

interface DiveSampleSubsampleData {
  id?: string;
  weight?: string;
  texture?: string;
  habitat?: string;
  description?: string;
  temperature?: string;
  salinity?: string;
  oxygen?: string;
  comments?: string;
}
export interface DiveSampleData extends DiveSampleSubsampleData {
  dive?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  latitudeStart?: string;
  latitudeEnd?: string;
  longitudeStart?: string;
  longitudeEnd?: string;
  waterDepthStart?: string;
  waterDepthEnd?: string;
  storageLocation?: string;
}
export interface DiveSampleHistory extends ItemHistory {
  snapshot?: DiveSampleData;
  diff?: Diff<DiveSampleData, DiveSampleData>[];
}
export interface DiveSample extends ItemMetadata, DiveSampleData {
  _docType: 'diveSample';
  _modified?: string;
  _validated?: string;
  _history: DiveSampleHistory[];
}
const diveSamplesDefault: { [uuID: string]: DiveSample } = {};
export const diveSamplesState = atom({
  key: 'dive samples',
  default: diveSamplesDefault,
});
export const modifiedDiveSamplesState = atom({
  key: 'modified dive samples',
  default: diveSamplesDefault,
});

export interface DiveSubsampleData extends DiveSampleSubsampleData {
  sample?: string;
  pi?: string;
  piInstitution?: string;
  piEmail?: string;
}
export interface DiveSubsampleHistory extends ItemHistory {
  snapshot?: DiveSubsampleData;
  diff?: Diff<DiveSubsampleData, DiveSubsampleData>[];
}
export interface DiveSubsample extends ItemMetadata, DiveSubsampleData {
  _docType: 'diveSubsample';
  _modified?: string;
  _validated?: string;
  _history: DiveSubsampleHistory[];
}
const diveSubsamplesDefault: { [uuID: string]: DiveSubsample } = {};
export const diveSubsamplesState = atom({
  key: 'dive subsamples',
  default: diveSubsamplesDefault,
});
export const modifiedDiveSubsamplesState = atom({
  key: 'modified dive subsamples',
  default: diveSubsamplesDefault,
});

export type Item =
  | Cruise
  | Core
  | Section
  | SectionHalf
  | SectionSample
  | Dive
  | DiveSample
  | DiveSubsample
  | undefined;

export type ItemData =
  | CruiseData
  | CoreData
  | SectionData
  | SectionHalfData
  | SectionSampleData
  | DiveData
  | DiveSampleData
  | DiveSubsampleData
  | undefined;

export type Items =
  | typeof cruisesDefault
  | typeof coresDefault
  | typeof sectionsDefault
  | typeof sectionHalvesDefault
  | typeof sectionSamplesDefault
  | typeof divesDefault
  | typeof diveSamplesDefault
  | typeof diveSubsamplesDefault
  | undefined;

export interface ItemsCollection {
  cruises?: typeof cruisesDefault;
  cores?: typeof coresDefault;
  sections?: typeof sectionsDefault;
  sectionHalves?: typeof sectionHalvesDefault;
  sectionSamples?: typeof sectionSamplesDefault;
  dives?: typeof divesDefault;
  diveSamples?: typeof diveSamplesDefault;
  diveSubsamples?: typeof diveSubsamplesDefault;
}
export interface ItemsCounts {
  cruises?: number;
  cores?: number;
  sections?: number;
  sectionHalves?: number;
  sectionSamples?: number;
  dives?: number;
  diveSamples?: number;
  diveSubsamples?: number;
}
