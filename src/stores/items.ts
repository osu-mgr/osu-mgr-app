import { Diff } from 'deep-diff';
import { atom } from 'recoil';

export type DocType =
  | 'cruise'
  | 'core'
  | 'section'
  | 'sectionHalf'
  | 'sectionSample'
  | 'dive'
  | 'diveSample'
  | 'diveSubsample';

export const docTypesHierarchy: Record<DocType, DocType[]> = {
  cruise: ['core', 'dive'],
  core: ['section'],
  section: ['sectionHalf'],
  sectionHalf: ['sectionSample'],
  sectionSample: [],
  dive: ['diveSample'],
  diveSample: ['diveSubsample'],
  diveSubsample: [],
};

export const cruiseIcon = 'ship';
export const coreIcon = 'circle';
export const sectionIcon = 'toggle off';
export const sectionHalfIcon = 'unlinkify';
export const sectionSampleIcon = 'cube';
export const diveIcon = 'shopping basket';
export const diveSampleIcon = 'cube';
export const diveSubsampleIcon = 'cubes';

export const coreTypes = {
  'Box Core': 'BC',
  'Calypso Core': 'CC',
  'Free Fall Core': 'FF',
  'Gravity Core': 'GC',
  'Jumbo Piston Core': 'JC',
  'Kasten Core': 'KC',
  'Multi Gravity Core': 'MG',
  Multicore: 'MC',
  'Piston Core': 'PC',
  'Push Core': 'PU',
  'Rock Core': 'RC',
  'Trigger Core': 'TC',
  UWITEC: 'UW',
  Vibracre: 'VC',
  'Wildco KB Gravity Core': 'KB',
};

export const diveTypes = {
  Dredge: 'D',
  ROV: 'D',
};

export const sectionHalfTypes = {
  Archive: 'A',
  Working: 'W',
  Round: 'R',
};

interface ItemHistory {
  login: string;
  datetime: string;
  action: 'insert' | 'update' | 'delete';
}

interface ItemMetadata {
  _uuid: string;
  _igsn: string;
  _cruiseUUID?: string;
  _coreUUID?: string;
  _sectionUUID?: string;
  _sectionHalfUUID?: string;
  _sectionSampleUUID?: string;
  _diveUUID?: string;
  _diveSampleUUID?: string;
  _diveSubsampleUUID?: string;
}
export interface CruiseData {
  id?: string;
  name?: string;
  rvName?: string;
  // TODO: collection?: 'mgg' | 'noaa' | 'acc'
  // TODO: r2rID?: string
}
export interface CruiseHistory extends ItemHistory {
  snapshot?: CruiseData;
  diff?: Diff<CruiseData, CruiseData>[];
}
export interface Cruise extends ItemMetadata, CruiseData {
  _docType: 'cruise';
  _modified?: string;
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
  notes?: string;
  pi?: string;
  piInstitution?: string;
  piEmail?: string;
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
}
export interface CoreHistory extends ItemHistory {
  snapshot?: CoreData;
  diff?: Diff<CoreData, CoreData>[];
}
export interface Core extends ItemMetadata, CoreData {
  _docType: 'core';
  _modified?: string;
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
}
export interface SectionHalfHistory extends ItemHistory {
  snapshot?: SectionHalfData;
  diff?: Diff<SectionHalfData, SectionHalfData>[];
}
export interface SectionHalf extends ItemMetadata, SectionHalfData {
  _docType: 'sectionHalf';
  _modified?: string;
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
}
export interface SectionSampleHistory extends ItemHistory {
  snapshot?: SectionSampleData;
  diff?: Diff<SectionSampleData, SectionSampleData>[];
}
export interface SectionSample extends ItemMetadata, SectionSampleData {
  _docType: 'sectionSample';
  _modified?: string;
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
}
export interface DiveSampleHistory extends ItemHistory {
  snapshot?: DiveSampleData;
  diff?: Diff<DiveSampleData, DiveSampleData>[];
}
export interface DiveSample extends ItemMetadata, DiveSampleData {
  _docType: 'diveSample';
  _modified?: string;
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
}
export interface DiveSubsampleHistory extends ItemHistory {
  snapshot?: DiveSubsampleData;
  diff?: Diff<DiveSubsampleData, DiveSubsampleData>[];
}
export interface DiveSubsample extends ItemMetadata, DiveSubsampleData {
  _docType: 'diveSubsample';
  _modified?: string;
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
