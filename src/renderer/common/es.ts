/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { ipcRenderer } from 'electron';
import {
  Client,
  RequestParams,
  ApiResponse,
} from '@opensearch-project/opensearch';

import { AccountType } from '../stores/accounts';
import {
  ItemType,
  Item,
  Items,
  ItemsSearch,
  SectionHalf,
  DiveSample,
  DiveSubsample,
} from '../stores/items';
import { locationPositionConfigurations } from './storageLocations';

// Complete definition of the Search response
interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

interface Explanation {
  value: number;
  description: string;
  details: Explanation[];
}

export interface Hit {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: Item;
  _version?: number;
  _explanation?: Explanation;
  fields?: any;
  highlight?: any;
  inner_hits?: any;
  matched_queries?: string[];
  sort?: string[];
}
interface SearchResponse {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: ShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: Hit[];
  };
  aggregations?: any;
  err?: Explanation;
}

export type DocType = AccountType | ItemType;

const client: Client = new Client({
  node:
    // ipcRenderer.sendSync('ipc-env', 'ES_NODE') ||
    'https://admin:admin@opensearch.marfik.earthref.org:9400',
});
const index = 'osu-mgr'; // ipcRenderer.sendSync('ipc-env', 'ES_INDEX') || 'osu-mgr-dev';

export async function* scrollSearch(params: any) {
  let response: ApiResponse<SearchResponse> = await client.search(params);
  while (true) {
    const sourceHits = response.body.hits.hits;
    if (sourceHits.length === 0) break;
    for (const hit of sourceHits) yield hit;
    if (!response.body._scroll_id) break;
    // eslint-disable-next-line no-await-in-loop
    response = await client.scroll({
      scroll_id: response.body._scroll_id as string,
      scroll: params.scroll as string,
    });
  }
}

export const indexDocs = async (docs: Items[]) => {
  const { body: bulkResponse } = await client.bulk({
    refresh: true,
    body: _.flatMap(docs, (doc) => {
      return doc === undefined
        ? []
        : [{ index: { _index: index, _id: doc?._uuid } }, doc];
    }),
  });
  return bulkResponse.errors;
};

export const searchByOSUIDPrefix = async (
  igsnPrefix: string,
  exact?: boolean,
  type?: DocType
): Promise<Hit[]> => {
  const must = type ? [{ term: { '_docType.keyword': type } }] : [];
  const params: RequestParams.Search = {
    size: 10000,
    index,
    body: {
      sort: [{ _modified: 'desc' }],
      query: {
        bool: {
          must,
          should: [
            exact ? { prefix: { '_osuid.keyword': `${igsnPrefix}-` } } : {},
            { term: { '_osuid.keyword': `${igsnPrefix}` } },
          ],
          minimum_should_match: 1,
        },
      },
    },
  };
  const docs: Hit[] = [];
  for await (const hit of scrollSearch(params)) {
    docs.push(hit);
  }
  return docs;
};

export const searchByUUIDs = async (
  uuids: string[],
  from: number,
  size: number,
  type: DocType
): Promise<Item[]> => {
  const docs: Item[] = [];
  if (from + size > 10000) return docs;
  const params: RequestParams.Search = {
    from,
    size,
    index,
    body: {
      sort: [
        { 'cruise.keyword': 'asc' },
        { _coreNumber: 'asc' },
        { _sectionNumber: 'asc' },
        { _diveNumber: 'asc' },
        { _diveSampleNumber: 'asc' },
        { '_osuid.keyword': 'asc' },
      ],
      query: {
        bool: {
          must: [{ term: { '_docType.keyword': type } }],
          should: [
            { terms: { '_uuid.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_cruiseUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_coreUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_sectionUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_sectionHalfUUID.keyword': uuids.map((x) => `${x}`) } },
            {
              terms: { '_sectionSampleUUID.keyword': uuids.map((x) => `${x}`) },
            },
            { terms: { '_diveUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_diveSampleUUID.keyword': uuids.map((x) => `${x}`) } },
            {
              terms: { '_diveSubsampleUUID.keyword': uuids.map((x) => `${x}`) },
            },
          ],
          minimum_should_match: 1,
        },
      },
    },
  };
  for await (const hit of scrollSearch(params)) {
    docs.push(hit._source);
  }
  return docs;
};

export const countByUUIDs = async (
  uuids: string[],
  type?: DocType
): Promise<number> => {
  const must = type ? [{ term: { '_docType.keyword': type } }] : [];
  const params: RequestParams.Search = {
    index,
    body: {
      query: {
        bool: {
          must,
          should: [
            { terms: { '_uuid.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_cruiseUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_coreUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_sectionUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_sectionHalfUUID.keyword': uuids.map((x) => `${x}`) } },
            {
              terms: { '_sectionSampleUUID.keyword': uuids.map((x) => `${x}`) },
            },
            { terms: { '_diveUUID.keyword': uuids.map((x) => `${x}`) } },
            { terms: { '_diveSampleUUID.keyword': uuids.map((x) => `${x}`) } },
            {
              terms: { '_diveSubsampleUUID.keyword': uuids.map((x) => `${x}`) },
            },
          ],
          minimum_should_match: 1,
        },
      },
    },
  };
  let count = -1;
  const response = await client.count(params);
  if (response && response.body && response.body.count >= 0)
    count = response.body.count as number;
  return count;
};

export const itemByUUID = async (uuid: string): Promise<Item | undefined> => {
  const params: RequestParams.Search = {
    size: 1,
    index,
    body: {
      query: {
        term: { '_uuid.keyword': `${uuid}` },
      },
    },
  };
  let item: Item;
  const response = await client.search(params);
  if (response && response.body.hits.hits && response.body.hits.hits.length)
    item = response.body.hits.hits[0]._source as Item;
  return item;
};

export const searchByType = async (
  docType?: string,
  search?: ItemsSearch,
  from?: number,
  size?: number,
  filter?: 'recent' | 'valid' | 'warning' | 'error'
): Promise<Hit[]> => {
  const docs: Hit[] = [];
  if (from && size && from + size > 10000) return docs;
  let boolMust: Record<any, any>[] = [];
  let boolMustNot: Record<any, any>[] = [];
  let boolFilter: Record<any, any>[] = [];
  if (docType !== undefined)
    boolMust = [...boolMust, { term: { '_docType.keyword': docType } }];
  else
    boolMustNot = [...boolMustNot, { term: { '_docType.keyword': 'account' } }];
  if (search && search.searchString !== '')
    boolMust = [
      ...boolMust,
      {
        bool: {
          should: [
            {
              multi_match: {
                query: search.searchString.toLowerCase(),
                type: 'bool_prefix',
                fields: ['*.substring'],
                operator: 'and',
                analyzer: 'whitespace',
              },
            },
            {
              prefix: {
                '_osuid.keyword': {
                  value: search.searchString.toUpperCase(),
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    ];
  if (search?.filter === 'recent' || filter === 'recent')
    boolMust = [...boolMust, { range: { _modified: { gte: 'now-1w' } } }];
  if (search?.filter === 'valid' || filter === 'valid') {
    boolMust = [...boolMust, { exists: { field: '_validated' } }];
    boolMustNot = [
      ...boolMustNot,
      { exists: { field: '_warnings' } },
      { exists: { field: '_errors' } },
    ];
    boolFilter = [
      ...boolFilter,
      {
        script: {
          script:
            "doc['_validated'].value.millis >= doc['_modified'].value.millis",
        },
      },
    ];
  }
  if (search?.filter === 'warning' || filter === 'warning')
    boolMust = [...boolMust, { exists: { field: '_warnings' } }];
  if (search?.filter === 'error' || filter === 'error')
    boolMust = [...boolMust, { exists: { field: '_errors' } }];
  let sort: Record<string, 'asc' | 'desc'>[] = [];
  if (search?.sortOrder === 'ids asc')
    sort = [
      { 'cruise.keyword': 'asc' },
      { _coreNumber: 'asc' },
      { _sectionNumber: 'asc' },
      { _diveNumber: 'asc' },
      { _diveSampleNumber: 'asc' },
      { '_osuid.keyword': 'asc' },
    ];
  if (search?.sortOrder === 'ids desc')
    sort = [
      { 'cruise.keyword': 'desc' },
      { _coreNumber: 'desc' },
      { _sectionNumber: 'desc' },
      { _diveNumber: 'desc' },
      { _diveSampleNumber: 'desc' },
      { '_osuid.keyword': 'desc' },
    ];
  if (search?.sortOrder === 'modified asc') sort = [{ _modified: 'asc' }];
  if (search?.sortOrder === 'modified desc') sort = [{ _modified: 'desc' }];
  if (search?.sortOrder === 'alpha asc') sort = [{ '_osuid.keyword': 'asc' }];
  if (search?.sortOrder === 'alpha desc') sort = [{ '_osuid.keyword': 'desc' }];
  const params: RequestParams.Search = {
    from: from || 0,
    size: size || 10000,
    index,
    body: {
      sort,
      query: {
        bool: { must: boolMust, must_not: boolMustNot, filter: boolFilter },
      },
      highlight: {
        pre_tags: '',
        post_tags: '',
        fields: { '*.substring': {} },
      },
    },
  };
  for await (const hit of scrollSearch(params)) {
    docs.push(hit);
  }
  return docs;
};

export const countByType = async (
  docType?: string,
  search?: ItemsSearch,
  filter?: 'recent' | 'valid' | 'warning' | 'error'
): Promise<number> => {
  let boolMust: Record<any, any>[] = [];
  let boolMustNot: Record<any, any>[] = [];
  let boolFilter: Record<any, any>[] = [];
  if (docType !== undefined)
    boolMust = [...boolMust, { term: { '_docType.keyword': docType } }];
  else
    boolMustNot = [...boolMustNot, { term: { '_docType.keyword': 'account' } }];
  if (search && search.searchString !== '')
    boolMust = [
      ...boolMust,
      {
        bool: {
          should: [
            {
              multi_match: {
                query: search.searchString.toLowerCase(),
                type: 'bool_prefix',
                fields: ['*.substring'],
                analyzer: 'whitespace',
              },
            },
            {
              prefix: {
                '_osuid.keyword': {
                  value: search?.searchString.toUpperCase(),
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    ];
  if (search?.filter === 'recent' || filter === 'recent')
    boolMust = [...boolMust, { range: { _modified: { gte: 'now-1w' } } }];
  if (search?.filter === 'valid' || filter === 'valid') {
    boolMust = [...boolMust, { exists: { field: '_validated' } }];
    boolMustNot = [
      ...boolMustNot,
      { exists: { field: '_warnings' } },
      { exists: { field: '_errors' } },
    ];
    boolFilter = [
      ...boolFilter,
      {
        script: {
          script:
            "doc['_validated'].value.millis >= doc['_modified'].value.millis",
        },
      },
    ];
  }
  if (search?.filter === 'warning' || filter === 'warning')
    boolMust = [...boolMust, { exists: { field: '_warnings' } }];
  if (search?.filter === 'error' || filter === 'error')
    boolMust = [...boolMust, { exists: { field: '_errors' } }];
  const params: RequestParams.Count = {
    index,
    body: {
      query: {
        bool: { must: boolMust, must_not: boolMustNot, filter: boolFilter },
      },
    },
  };
  let count = -1;
  const response = await client.count(params);
  if (response && response.body && response.body.count >= 0)
    count = response.body.count as number;
  return count;
};

export const searchByLocation = async (
  location?: string,
  rack?: string,
  position?: string,
  slot?: string,
  search?: ItemsSearch,
  from?: number,
  size?: number,
  filter?: 'recent' | 'valid' | 'warning' | 'error'
): Promise<Hit[]> => {
  const docs: Hit[] = [];
  if (from && size && from + size > 10000) return docs;
  let boolMust: Record<any, any>[] = [
    { term: { '_docType.keyword': 'sectionHalf' } },
  ];
  let boolMustNot: Record<any, any>[] = [];
  let boolFilter: Record<any, any>[] = [];
  let locationPrefix = location || '';
  if (rack) {
    locationPrefix += `-${rack}`;
    if (position) {
      locationPrefix += `-${position}`;
      if (slot) {
        locationPrefix += `-${slot}`;
      }
    }
  }
  if (locationPrefix !== '')
    boolMust = [
      ...boolMust,
      { prefix: { 'storageLocation.keyword': locationPrefix.toUpperCase() } },
    ];
  else
    boolMust = [...boolMust, { exists: { field: 'storageLocation.keyword' } }];
  if (search && search.searchString !== '')
    boolMust = [
      ...boolMust,
      {
        bool: {
          should: [
            {
              multi_match: {
                query: search.searchString.toLowerCase(),
                type: 'bool_prefix',
                fields: ['*.substring'],
                analyzer: 'whitespace',
              },
            },
            {
              prefix: {
                '_osuid.keyword': {
                  value: search.searchString.toUpperCase(),
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    ];
  if (search?.filter === 'recent' || filter === 'recent')
    boolMust = [...boolMust, { range: { _modified: { gte: 'now-1w' } } }];
  if (search?.filter === 'valid' || filter === 'valid') {
    boolMust = [...boolMust, { exists: { field: '_validated' } }];
    boolMustNot = [
      ...boolMustNot,
      { exists: { field: '_warnings' } },
      { exists: { field: '_errors' } },
    ];
    boolFilter = [
      ...boolFilter,
      {
        script: {
          script:
            "doc['_validated'].value.millis >= doc['_modified'].value.millis",
        },
      },
    ];
  }
  if (search?.filter === 'warning' || filter === 'warning')
    boolMust = [...boolMust, { exists: { field: '_warnings' } }];
  if (search?.filter === 'error' || filter === 'error')
    boolMust = [...boolMust, { exists: { field: '_errors' } }];
  let sort: Record<string, 'asc' | 'desc'>[] = [];
  if (search?.sortOrder === 'ids asc')
    sort = [
      { 'cruise.keyword': 'asc' },
      { _coreNumber: 'asc' },
      { _sectionNumber: 'asc' },
      { _diveNumber: 'asc' },
      { _diveSampleNumber: 'asc' },
      { '_osuid.keyword': 'asc' },
    ];
  if (search?.sortOrder === 'ids desc')
    sort = [
      { 'cruise.keyword': 'desc' },
      { _coreNumber: 'desc' },
      { _sectionNumber: 'desc' },
      { _diveNumber: 'desc' },
      { _diveSampleNumber: 'desc' },
      { '_osuid.keyword': 'desc' },
    ];
  if (search?.sortOrder === 'modified asc') sort = [{ _modified: 'asc' }];
  if (search?.sortOrder === 'modified desc') sort = [{ _modified: 'desc' }];
  if (search?.sortOrder === 'alpha asc') sort = [{ '_osuid.keyword': 'asc' }];
  if (search?.sortOrder === 'alpha desc') sort = [{ '_osuid.keyword': 'desc' }];
  const params: RequestParams.Search = {
    from: from || 0,
    size: size || 10000,
    index,
    body: {
      sort,
      query: {
        bool: { must: boolMust, must_not: boolMustNot, filter: boolFilter },
      },
      highlight: {
        pre_tags: '',
        post_tags: '',
        fields: { '*.substring': {} },
      },
    },
  };
  for await (const hit of scrollSearch(params)) {
    docs.push(hit);
  }
  return docs;
};

export const countByLocation = async (
  location?: string,
  rack?: string,
  position?: string,
  slot?: string,
  search?: ItemsSearch,
  filter?: 'recent' | 'valid' | 'warning' | 'error'
): Promise<number> => {
  let boolMust: Record<any, any>[] = [
    { terms: { '_docType.keyword': ['sectionHalf', 'diveSample'] } },
  ];
  let boolMustNot: Record<any, any>[] = [];
  let boolFilter: Record<any, any>[] = [];
  let locationPrefix = location || '';
  if (rack) {
    locationPrefix += `-${rack}`;
    if (position) {
      locationPrefix += `-${position}`;
      if (slot) {
        locationPrefix += `-${slot}`;
      }
    }
  }
  if (locationPrefix !== '')
    boolMust = [
      ...boolMust,
      { prefix: { 'storageLocation.keyword': locationPrefix.toUpperCase() } },
    ];
  else
    boolMust = [...boolMust, { exists: { field: 'storageLocation.keyword' } }];
  if (search && search.searchString !== '')
    boolMust = [
      ...boolMust,
      {
        bool: {
          should: [
            {
              multi_match: {
                query: search.searchString.toLowerCase(),
                type: 'bool_prefix',
                fields: ['*.substring'],
                analyzer: 'whitespace',
              },
            },
            {
              prefix: {
                '_osuid.keyword': {
                  value: search?.searchString.toUpperCase(),
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    ];
  if (search?.filter === 'recent' || filter === 'recent')
    boolMust = [...boolMust, { range: { _modified: { gte: 'now-1w' } } }];
  if (search?.filter === 'valid' || filter === 'valid') {
    boolMust = [...boolMust, { exists: { field: '_validated' } }];
    boolMustNot = [
      ...boolMustNot,
      { exists: { field: '_warnings' } },
      { exists: { field: '_errors' } },
    ];
    boolFilter = [
      ...boolFilter,
      {
        script: {
          script:
            "doc['_validated'].value.millis >= doc['_modified'].value.millis",
        },
      },
    ];
  }
  if (search?.filter === 'warning' || filter === 'warning')
    boolMust = [...boolMust, { exists: { field: '_warnings' } }];
  if (search?.filter === 'error' || filter === 'error')
    boolMust = [...boolMust, { exists: { field: '_errors' } }];
  const params: RequestParams.Count = {
    index,
    body: {
      query: {
        bool: { must: boolMust, must_not: boolMustNot, filter: boolFilter },
      },
    },
  };
  let count = -1;
  const response = await client.count(params);
  if (response && response.body && response.body.count >= 0)
    count = response.body.count as number;
  return count;
};

export const weightByLocation = async (
  location?: string,
  rack?: string,
  position?: string,
  slot?: string
): Promise<number> => {
  let boolMust: Record<any, any>[] = [
    { terms: { '_docType.keyword': ['sectionHalf', 'diveSample'] } },
  ];
  let locationPrefix = location || '';
  if (rack) {
    locationPrefix += `-${rack}`;
    if (position) {
      locationPrefix += `-${position}`;
      if (slot) {
        locationPrefix += `-${slot}`;
      }
    }
  }
  if (locationPrefix !== '')
    boolMust = [
      ...boolMust,
      { prefix: { 'storageLocation.keyword': locationPrefix.toUpperCase() } },
    ];
  else
    boolMust = [...boolMust, { exists: { field: 'storageLocation.keyword' } }];
  const params: RequestParams.Search = {
    index,
    size: 10000,
    _source: 'weight',
    body: {
      query: {
        bool: { must: boolMust },
      },
    },
  };
  let weight = 0;
  for await (const hit of scrollSearch(params)) {
    const doc = hit._source as SectionHalf | DiveSample;
    doc.weight && (weight += parseFloat(doc.weight));
  }
  return weight;
};

export const storageByLocation = async (
  location?: string,
  rack?: string,
  position?: string,
  slot?: string
): Promise<string[]> => {
  let boolMust: Record<any, any>[] = [
    { terms: { '_docType.keyword': ['sectionHalf', 'diveSample'] } },
  ];
  let locationPrefix = location || '';
  if (rack) {
    locationPrefix += `-${rack}`;
    if (position) {
      locationPrefix += `-${position}`;
      if (slot) {
        locationPrefix += `-${slot}`;
      }
    }
  }
  if (locationPrefix !== '')
    boolMust = [
      ...boolMust,
      { prefix: { 'storageLocation.keyword': locationPrefix.toUpperCase() } },
    ];
  else
    boolMust = [...boolMust, { exists: { field: 'storageLocation.keyword' } }];
  const params: RequestParams.Search = {
    index,
    size: 10000,
    _source: 'storageLocation',
    body: {
      query: {
        bool: { must: boolMust },
      },
    },
  };
  let storageLocations = {};
  for await (const hit of scrollSearch(params)) {
    const doc = hit._source as SectionHalf;
    doc.storageLocation && (storageLocations[doc.storageLocation] = true);
  }
  return _.keys(storageLocations);
};

// export const upsertItem = async (item: Item) => {
//   const params: RequestParams.Index = {
//     index,
//     id: item._uuid,
//     body: item,
//   };
//   const response = await client.index(params);
//   return response;
// }
