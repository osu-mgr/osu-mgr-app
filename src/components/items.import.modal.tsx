import _ from 'lodash';
import { DateTime } from 'luxon';
// import { diff } from 'deep-diff';
import { v4 as uuIDV4 } from 'uuid';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, Icon, Grid, List, Dimmer, Segment } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import Modal from './modal';
import GridIconRow from './grid.icon-row';
import { loginState } from '../stores/accounts';
import {
  docTypesHierarchy,
  Item,
  ItemsCollection,
  ItemsCounts,
  Cruise,
  CruiseData,
  cruiseIcon,
  Core,
  CoreData,
  coreIcon,
  Section,
  SectionData,
  sectionIcon,
  SectionHalf,
  SectionHalfData,
  sectionHalfIcon,
  /* SectionSample, SectionSampleData, */ sectionSampleIcon,
  Dive,
  DiveData,
  diveIcon,
  diveTypes,
  DiveSample,
  DiveSampleData,
  diveSampleIcon,
  DiveSubsample,
  DiveSubsampleData,
  diveSubsampleIcon,
  sectionHalfTypes,
} from '../stores/items';
import { Hit, searchByIGSNPrefix } from '../es';

function omitEmpty(before: Record<string, string>) {
  const after: Record<string, string> = {};
  _.keys(before).forEach((x) => {
    if (before[x] !== undefined || _.trim(before[x]) !== '')
      after[x] = _.trim(before[x]);
  });
  return after;
}

function parseMasterSheetRow(
  row: Record<string, string>,
  login: string,
  items: ItemsCollection
): ItemsCollection {
  const thisCruise: CruiseData = omitEmpty({
    id: row['CRUISE Name'],
    name: row['{Cruise Name or Program Name}'],
    rvName: row['RV Name'],
  });
  const cruiseID = thisCruise.id || 'Cruise?';
  const cruiseUUID =
    (items.cruises &&
      items.cruises[cruiseID] &&
      items.cruises[cruiseID]._uuid) ||
    uuIDV4();
  if (!_.isEmpty(thisCruise)) {
    items.cruises = items.cruises || {};
    const cruise: Cruise = {
      ...items.cruises[cruiseID],
      ...thisCruise,
      _igsn: `OSU-${cruiseID}`,
      _uuid: cruiseUUID,
      _cruiseUUID: cruiseUUID,
      _docType: 'cruise',
      _modified: DateTime.now().toISO(),
      _history: [{ login, datetime: DateTime.now().toISO(), action: 'insert' }],
    };
    items.cruises[cruiseID] = cruise;
  }

  const thisCore: CoreData = omitEmpty(
    row['Recovery Method'] === undefined || !diveTypes[row['Recovery Method']]
      ? {
          id: row['Deployment or Dive'],
          material: row.Material,
          method: row['Recovery Method'],
          startDate: row['Date Collected'],
          endDate: row['{End Date Collected}'],
          startTime: row['Time Collected'],
          endTime: row['{End Time Collected}'],
          latitudeStart: row.Latitude,
          latitudeEnd: row['{End Latitude}'],
          longitudeStart: row.Longitude,
          longitudeEnd: row['{End Longitude}'],
          waterDepthStart: row['Water Depth'],
          waterDepthEnd: row['{End Water Depth}'],
          area: row['{Area}'],
          place: row['{Place Name}'],
          notes: row['{Notes}'],
          pi: row['Contact PI'],
          piInstitution: row['PI Institution'],
          piEmail: row['Contact PI email'],
          diameter: row['Core Diameter'],
          length: row['Parent Core Length'],
        }
      : {}
  );
  const coreID = `${cruiseID}-${thisCore.id || 'Core?'}`;
  const coreUUID =
    (items.cores && items.cores[coreID] && items.cores[coreID]._uuid) ||
    uuIDV4();
  if (!_.isEmpty(thisCore)) {
    items.cores = items.cores || {};
    const core: Core = {
      ...items.cores[coreID],
      ...thisCore,
      cruise: cruiseID,
      _igsn: `OSU-${coreID}`,
      _uuid: coreUUID,
      _cruiseUUID: cruiseUUID,
      _coreUUID: coreUUID,
      _docType: 'core',
      _modified: DateTime.now().toISO(),
      _history: [{ login, datetime: DateTime.now().toISO(), action: 'insert' }],
    };
    items.cores[coreID] = core;
  }

  const thisSection: SectionData = omitEmpty({
    id: row['SECTION or MC #'],
    alternateName: row['{Alternate Section Name}'],
    depthTop: row['DEPTH TOP (cm)'],
    depthBottom: row['SECTION LENGTH (cm)'],
  });
  const sectionID = `${coreID}-${thisSection.id || 'Section?'}`;
  const sectionUUID =
    (items.sections &&
      items.sections[sectionID] &&
      items.sections[sectionID]._uuid) ||
    uuIDV4();
  if (!_.isEmpty(thisSection)) {
    items.sections = items.sections || {};
    const section: Section = {
      ...items.sections[sectionID],
      ...thisSection,
      core: coreID,
      _igsn: `OSU-${sectionID}`,
      _uuid: sectionUUID,
      _cruiseUUID: cruiseUUID,
      _coreUUID: coreUUID,
      _sectionUUID: sectionUUID,
      _docType: 'section',
      _modified: DateTime.now().toISO(),
      _history: [{ login, datetime: DateTime.now().toISO(), action: 'insert' }],
    };
    items.sections[sectionID] = section;
  }

  const thisSectionHalf: SectionHalfData = omitEmpty({
    type: row['Working/Archive'],
  });
  const sectionHalfType =
    (thisSectionHalf.type && sectionHalfTypes[thisSectionHalf.type]) ||
    undefined;
  const sectionHalfID = `${sectionID}-${sectionHalfType || 'SectionHalf?'}`;
  const sectionHalfUUID =
    (items.sectionHalves &&
      items.sectionHalves[sectionHalfID] &&
      items.sectionHalves[sectionHalfID]._uuid) ||
    uuIDV4();
  if (!_.isEmpty(thisSection)) {
    items.sectionHalves = items.sectionHalves || {};
    const sectionHalf: SectionHalf = {
      ...items.sectionHalves[sectionHalfID],
      ...thisSectionHalf,
      section: sectionID,
      _igsn: `OSU-${sectionHalfID}`,
      _uuid: sectionHalfUUID,
      _cruiseUUID: cruiseUUID,
      _coreUUID: coreUUID,
      _sectionUUID: sectionUUID,
      _sectionHalfUUID: sectionHalfUUID,
      _docType: 'sectionHalf',
      _modified: DateTime.now().toISO(),
      _history: [{ login, datetime: DateTime.now().toISO(), action: 'insert' }],
    };
    items.sectionHalves[sectionHalfID] = sectionHalf;
  }

  const thisDive: DiveData = omitEmpty(
    row['Recovery Method'] !== undefined && diveTypes[row['Recovery Method']]
      ? {
          id: row['Deployment or Dive'],
          material: row.Material,
          method: row['Recovery Method'],
          area: row['{Area}'],
          place: row['{Place Name}'],
          // notes: row['{Notes}'],
          pi: row['Contact PI'],
          piInstitution: row['PI Institution'],
          piEmail: row['Contact PI email'],
          rov: row['ROV Name'],
          weight: row['Recovery Weight (kg)'],
        }
      : {}
  );
  const diveID = `${cruiseID}-${thisDive.id || 'Dive?'}`;
  const diveUUID =
    (items.dives && items.dives[diveID] && items.dives[diveID]._uuid) ||
    uuIDV4();
  if (!_.isEmpty(thisDive)) {
    items.dives = items.dives || {};
    const dive: Dive = {
      ...items.dives[diveID],
      ...thisDive,
      cruise: cruiseID,
      _igsn: `OSU-${diveID}`,
      _uuid: diveUUID,
      _cruiseUUID: cruiseUUID,
      _diveUUID: diveUUID,
      _docType: 'dive',
      _modified: DateTime.now().toISO(),
      _history: [{ login, datetime: DateTime.now().toISO(), action: 'insert' }],
    };
    items.dives[diveID] = dive;
  }

  const thisDiveSample: DiveSampleData = omitEmpty(
    row['{Subsample Number}'] === undefined
      ? {
          id: row['Sample Number'],
          startDate: row['Date Collected'],
          endDate: row['{End Date Collected}'],
          startTime: row['Time Collected'],
          endTime: row['{End Time Collected}'],
          latitudeStart: row.Latitude,
          latitudeEnd: row['{End Latitude}'],
          longitudeStart: row.Longitude,
          longitudeEnd: row['{End Longitude}'],
          waterDepthStart: row['Water Depth'],
          waterDepthEnd: row['{End Water Depth}'],
          weight: row['Sample Weight (kg)'],
          texture: row['Principal Texture'],
          habitat: row.Habitat,
          description: row['Other Descriptive Information'],
          temperature: row.Temp,
          salinity: row.Salinity,
          oxygen: row.Oxygen,
          comments: row['Other Condition Comments'],
        }
      : {}
  );
  const diveSampleID = `${diveID}-${thisDiveSample.id || 'DiveSample?'}`;
  const diveSampleUUID =
    (items.diveSamples &&
      items.diveSamples[diveSampleID] &&
      items.diveSamples[diveSampleID]._uuid) ||
    uuIDV4();
  if (!_.isEmpty(thisDiveSample)) {
    items.diveSamples = items.diveSamples || {};
    const diveSample: DiveSample = {
      ...items.diveSamples[diveSampleID],
      ...thisDiveSample,
      dive: diveID,
      _igsn: `OSU-${diveID}`,
      _uuid: diveSampleUUID,
      _cruiseUUID: cruiseUUID,
      _diveUUID: diveUUID,
      _diveSampleUUID: diveSampleUUID,
      _docType: 'diveSample',
      _modified: DateTime.now().toISO(),
      _history: [{ login, datetime: DateTime.now().toISO(), action: 'insert' }],
    };
    items.diveSamples[diveSampleID] = diveSample;
  }

  const thisDiveSubsample: DiveSubsampleData = omitEmpty(
    row['{Subsample Number}'] !== undefined
      ? {
          id: row['{Subsample Number}'],
          weight: row['Sample Weight (kg)'],
          texture: row['Principal Texture'],
          habitat: row.Habitat,
          description: row['Other Descriptive Information'],
          temperature: row.Temp,
          salinity: row.Salinity,
          oxygen: row.Oxygen,
          comments: row['Other Condition Comments'],
        }
      : {}
  );
  const diveSubsampleID = `${diveSampleID}-${
    thisDiveSubsample.id || 'DiveSample?'
  }`;
  const diveSubsampleUUID =
    (items.diveSubsamples &&
      items.diveSubsamples[diveSubsampleID] &&
      items.diveSubsamples[diveSubsampleID]._uuid) ||
    uuIDV4();
  if (!_.isEmpty(thisDiveSubsample)) {
    items.diveSubsamples = items.diveSubsamples || {};
    const diveSubsample: DiveSubsample = {
      ...items.diveSubsamples[diveSubsampleID],
      ...thisDiveSubsample,
      sample: diveSampleID,
      _igsn: `OSU-${diveID}`,
      _uuid: diveSubsampleUUID,
      _cruiseUUID: cruiseUUID,
      _diveUUID: diveUUID,
      _diveSampleUUID: diveSampleUUID,
      _diveSubsampleUUID: diveSubsampleUUID,
      _docType: 'diveSubsample',
      _modified: DateTime.now().toISO(),
      _history: [{ login, datetime: DateTime.now().toISO(), action: 'insert' }],
    };
    items.diveSubsamples[diveSubsampleID] = diveSubsample;
  }

  return items;
}

async function prepareItemDocs(
  items: ItemsCollection
): Promise<{
  items: ItemsCollection;
  errors: Record<string, unknown>[];
}> {
  const errors: Record<string, unknown>[] = [];
  try {
    const existingDocs: Hit[] = (
      await Promise.all(
        _.keys(items.cruises).map((cruiseID) =>
          searchByIGSNPrefix(`OSU-${cruiseID}-`)
        )
      )
    ).flat(1);
    const existingDocsByIGSN = {};
    for (const doc of existingDocs) {
      if (doc._source && doc._source._uuid && doc._source._igsn) {
        existingDocsByIGSN[doc._source._igsn] = doc._source;
      }
    }
    const uuidToReplace = {};
    for (const itemDocType of _.keys(items)) {
      for (const item of items[itemDocType] as Item[]) {
        if (item && item._igsn && existingDocsByIGSN[item._igsn]) {
          const existingDoc = existingDocsByIGSN[item?._igsn];
          item._history[0].action = 'update';
          item._history = [...existingDoc._history, item._history[0]];
          item._uuid = uuidToReplace[item?._uuid];
          uuidToReplace[item._uuid] = existingDoc._uuid;
        }
      }
    }
    for (const itemDocType of _.keys(items)) {
      for (const item of items[itemDocType] as Item[]) {
        for (const docType of _.keys(docTypesHierarchy)) {
          if (
            item && [`_uuid${docType}`] &&
            uuidToReplace[item[`_uuid${docType}`]]
          )
            item[`_uuid${docType}`] = uuidToReplace[item[`_uuid${docType}`]];
        }
      }
    }
  } catch (e) {
    errors.push({ searchByID: e });
    return { items, errors };
  }

  return { items, errors };
}

async function parseFiles(
  filePaths: string[],
  login: string
): Promise<{
  fileItems: { [filePath: string]: ItemsCollection };
  errors?: Record<string, unknown>[];
}> {
  const fileItems: { [filePath: string]: ItemsCollection } = {};
  const errors: Record<string, unknown>[] = [];
  filePaths.forEach(async (filePath) => {
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(filePath);
    } catch (e) {
      errors.push({ filePath, fileRead: e });
      return;
    }

    let wb: XLSX.WorkBook;
    try {
      wb = XLSX.read(fileBuffer);
    } catch (e) {
      errors.push({ filePath, sheetRead: e });
      return;
    }

    for (const sheetName of wb.SheetNames) {
      console.log('wb.SheetNames', filePath, sheetName);
      if (sheetName === 'Master Sheet') {
        const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(
          wb.Sheets[sheetName]
        );
        let parsedItems: ItemsCollection = {};
        for (const row of rows) {
          parsedItems = parseMasterSheetRow(row, login, parsedItems);
        }
        console.log('parsed items', parsedItems);
        const {
          items: preparedItems,
          errors: prepareErrors,
          // eslint-disable-next-line no-await-in-loop
        } = await prepareItemDocs(parsedItems);
        fileItems[filePath] = preparedItems;
        if (prepareErrors.length) {
          errors.push(
            ...prepareErrors.map((x) => {
              return { filePath, ...x };
            })
          );
        }
      }
      if (sheetName === 'Metadata Submission') {
        // parsedFiles[filePath].rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
      }
    }
  });
  console.log('parseFiles', fileItems, errors);
  return { fileItems, errors };
}

/* function nextID(obj: object, prefix: string, suffix: string): string {
	let n = 1;
	while (obj[`${prefix}${n}${suffix}`]) { n++; }
	return `${prefix}${n}${suffix}`;
} */

async function importFileItems(fileItems: {
  [filePath: string]: ItemsCollection;
}): Promise<{
  importedCounts: ItemsCounts;
  errors: Record<string, unknown>[];
}> {
  const importedCounts = {};
  const errors: Record<string, unknown>[] = [];
  for (const filePath of _.keys(fileItems)) {
    console.log('importFileItems filePath', filePath);
    for (const docType of _.keys(fileItems[filePath])) {
      console.log(
        'importFileItems docType',
        docType,
        _.keys(fileItems[filePath][docType]).length
      );
      importedCounts[docType] = importedCounts[docType] || 0;
      importedCounts[docType] += _.keys(fileItems[filePath][docType]).length;
    }
  }
  console.log('importFileItems importedCounts', importedCounts);
  return { importedCounts, errors };
}

const ItemsImportModal: FunctionComponent = React.memo(({ children }) => {
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [fileItems, setFileItems] = useState<
    { [filePath: string]: ItemsCollection } | undefined
  >(undefined);
  const [importedCounts, setImportedCounts] = useState<ItemsCounts>({});
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [loading, setLoading] = useState('');
  // const [errors, setErrors] = useState<object[]>([]);
  const login = useRecoilValue(loginState);
  useEffect(() => {
    if (!parsing && filePaths.length > 0 && loading === 'Parsing')
      (async () => {
        setParsing(true);
        const {
          fileItems: newFileItems,
          errors: parseErrors,
        } = await parseFiles(filePaths, login);
        console.log('parsed items', newFileItems, parseErrors);
        setFileItems(newFileItems);
        setLoading('');
      })();
  }, [parsing, filePaths, loading, login]);
  useEffect(() => {
    if (!importing && fileItems && loading === 'Importing')
      (async () => {
        setImporting(true);
        const {
          importedCounts: newImportedCounts,
          errors: importErrors,
        } = await importFileItems(fileItems);
        console.log('imported counts', newImportedCounts, importErrors);
        setImportedCounts(newImportedCounts);
        setLoading('');
      })();
  }, [importing, fileItems, loading]);

  console.log('ItemsImportModal', loading, fileItems);
  return (
    <Modal
      trigger={children}
      icon="file excel"
      cornerIcon="chevron circle up"
      title="Import Items"
      loading={loading}
      buttons={(close) => (
        <>
          <Button
            primary
            icon
            disabled={loading === 'Importing' || fileItems === undefined}
            onClick={() => setLoading('Importing')}
          >
            <Icon name="check" /> Import
          </Button>
          {!_.isEmpty(importedCounts) && (
            <Dimmer active page>
              <h3>Imported:</h3>
              <Segment basic compact>
                <Grid padded>
                  {importedCounts.cruises && importedCounts.cruises > 0 && (
                    <GridIconRow icon={cruiseIcon} iconWidth={7}>
                      {importedCounts.cruises} Cruise
                      {importedCounts.cruises > 1 && 's'} / Program
                      {importedCounts.cruises > 1 && 's'}
                    </GridIconRow>
                  )}
                  {importedCounts.cores && importedCounts.cores > 0 && (
                    <GridIconRow icon={coreIcon} iconWidth={7}>
                      {importedCounts.cores} Core
                      {importedCounts.cores > 1 && 's'}
                    </GridIconRow>
                  )}
                  {importedCounts.sections && importedCounts.sections > 0 && (
                    <GridIconRow icon={sectionIcon} iconWidth={7}>
                      {importedCounts.sections} Section
                      {importedCounts.sections > 1 && 's'}
                    </GridIconRow>
                  )}
                  {importedCounts.sectionHalves &&
                    importedCounts.sectionHalves > 0 && (
                      <GridIconRow icon={sectionHalfIcon} iconWidth={7}>
                        {importedCounts.sectionHalves} Section Hal
                        {importedCounts.sectionHalves === 0 && 'f'}
                        {importedCounts.sectionHalves > 1 && 'ves'}
                      </GridIconRow>
                    )}
                  {importedCounts.sectionSamples &&
                    importedCounts.sectionSamples > 0 && (
                      <GridIconRow icon={sectionSampleIcon} iconWidth={7}>
                        {importedCounts.sectionSamples} Section Sample
                        {importedCounts.sectionSamples > 1 && 's'}
                      </GridIconRow>
                    )}
                  {importedCounts.dives && importedCounts.dives > 0 && (
                    <GridIconRow icon={diveIcon} iconWidth={7}>
                      {importedCounts.dives} Dive
                      {importedCounts.dives > 1 && 's'}
                    </GridIconRow>
                  )}
                  {importedCounts.diveSamples &&
                    importedCounts.diveSamples > 0 && (
                      <GridIconRow icon={diveSampleIcon} iconWidth={7}>
                        {importedCounts.diveSamples} Dive Sample
                        {importedCounts.diveSamples > 1 && 's'}
                      </GridIconRow>
                    )}
                  {importedCounts.diveSubsamples &&
                    importedCounts.diveSubsamples > 0 && (
                      <GridIconRow icon={diveSubsampleIcon} iconWidth={7}>
                        {importedCounts.diveSubsamples} Dive Subsample
                        {importedCounts.diveSubsamples > 1 && 's'}
                      </GridIconRow>
                    )}
                </Grid>
              </Segment>
              <Button onClick={close}>Close</Button>
            </Dimmer>
          )}
        </>
      )}
      onClose={() => {
        setFilePaths([]);
        setFileItems(undefined);
        setImportedCounts({});
        setParsing(false);
        setImporting(false);
        setLoading('');
      }}
      hideCancel={loading === 'Importing'}
    >
      {filePaths.length === 0 && (
        <List relaxed="very" divided>
          <List.Item>
            <Button
              primary
              icon
              fluid
              size="huge"
              onClick={() => {
                remote.dialog
                  .showOpenDialog({
                    properties: ['openFile', 'multiSelections'],
                  })
                  .then((result) => {
                    if (result.filePaths && !result.canceled) {
                      setFilePaths(result.filePaths);
                      setLoading('Parsing');
                    }
                    return false;
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
            >
              <Icon name="th" style={{ padding: 0 }} /> Metadata Spreadsheet
            </Button>
          </List.Item>
          <List.Item>
            <Button primary icon fluid size="huge">
              <Icon name="clipboard list" style={{ padding: 0 }} /> Submission
              Spreadsheet
            </Button>
          </List.Item>
          <List.Item>
            <Button primary icon fluid size="huge">
              <Icon name="align right" style={{ padding: 0 }} /> Items
              Spreadsheet
            </Button>
          </List.Item>
        </List>
      )}
      {filePaths.length > 0 && (
        <List relaxed="very" divided>
          {filePaths.map((filePath, idx) => (
            <List.Item key={idx}>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <h5>{path.basename(filePath)}</h5>
                  </Grid.Column>
                </Grid.Row>
                <GridIconRow icon="file excel outline">{filePath}</GridIconRow>
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].cruises).length > 0 && (
                    <GridIconRow icon={cruiseIcon}>
                      {_.keys(fileItems[filePath].cruises).length} Cruise
                      {_.keys(fileItems[filePath].cruises).length > 1 && 's'} /
                      Program
                      {_.keys(fileItems[filePath].cruises).length > 1 && 's'}
                    </GridIconRow>
                  )}
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].cores).length > 0 && (
                    <GridIconRow icon={coreIcon}>
                      {_.keys(fileItems[filePath].cores).length} Core
                      {_.keys(fileItems[filePath].cores).length > 1 && 's'}
                    </GridIconRow>
                  )}
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].sections).length > 0 && (
                    <GridIconRow icon={sectionIcon}>
                      {_.keys(fileItems[filePath].sections).length} Section
                      {_.keys(fileItems[filePath].sections).length > 1 && 's'}
                    </GridIconRow>
                  )}
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].sectionHalves).length > 0 && (
                    <GridIconRow icon={sectionHalfIcon}>
                      {_.keys(fileItems[filePath].sectionHalves).length} Section
                      Hal
                      {_.keys(fileItems[filePath].sectionHalves).length === 0 &&
                        'f'}
                      {_.keys(fileItems[filePath].sectionHalves).length > 1 &&
                        'ves'}
                    </GridIconRow>
                  )}
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].sectionSamples).length > 0 && (
                    <GridIconRow icon={sectionSampleIcon}>
                      {_.keys(fileItems[filePath].sectionSamples).length}{' '}
                      Section Sample
                      {_.keys(fileItems[filePath].sectionSamples).length > 1 &&
                        's'}
                    </GridIconRow>
                  )}
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].dives).length > 0 && (
                    <GridIconRow icon={diveIcon}>
                      {_.keys(fileItems[filePath].dives).length} Dive
                      {_.keys(fileItems[filePath].dives).length > 1 && 's'}
                    </GridIconRow>
                  )}
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].diveSamples).length > 0 && (
                    <GridIconRow icon={diveSampleIcon}>
                      {_.keys(fileItems[filePath].diveSamples).length} Dive
                      Sample
                      {_.keys(fileItems[filePath].diveSamples).length > 1 &&
                        's'}
                    </GridIconRow>
                  )}
                {fileItems &&
                  fileItems[filePath] &&
                  _.keys(fileItems[filePath].diveSubsamples).length > 0 && (
                    <GridIconRow icon={diveSubsampleIcon}>
                      {_.keys(fileItems[filePath].diveSubsamples).length} Dive
                      Subsample
                      {_.keys(fileItems[filePath].diveSubsamples).length > 1 &&
                        's'}
                    </GridIconRow>
                  )}
              </Grid>
            </List.Item>
          ))}
        </List>
      )}
    </Modal>
  );
});

export default ItemsImportModal;
