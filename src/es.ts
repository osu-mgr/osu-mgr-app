import _ from 'lodash';
import electron from 'electron';
import { Client, RequestParams, ApiResponse } from '@elastic/elasticsearch';

import { DocType, Item, Items, ItemsSearch } from './stores/items';

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

const client: Client = new Client({
  node:
    electron.remote.process.env.ES_NODE ||
    'http://admin:admin@128.193.70.68:9400',
});
const index = electron.remote.process.env.ES_INDEX || 'osu-mgr';

async function* scrollSearch(params: any) {
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
            { prefix: { '_osuid.keyword': `${igsnPrefix}-` } },
            { term: { '_osuid.keyword': `${igsnPrefix}` } },
          ],
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
  let must: Record<any, any>[] = [];
  let mustNot: Record<any, any>[] = [];
  if (docType !== undefined)
    must = [...must, { term: { '_docType.keyword': docType } }];
  if (search && search.searchString !== '')
    must = [
      ...must,
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
    must = [...must, { range: { _modified: { gte: 'now-1w' } } }];
  if (search?.filter === 'valid' || filter === 'valid')
    mustNot = [
      ...mustNot,
      { exists: { field: '_warnings' } },
      { exists: { field: '_errors' } },
    ];
  if (search?.filter === 'warning' || filter === 'warning')
    must = [...must, { exists: { field: '_warnings' } }];
  if (search?.filter === 'error' || filter === 'error')
    must = [...must, { exists: { field: '_errors' } }];
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
      query: { bool: { must, must_not: mustNot } },
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
  let must: Record<any, any>[] = [];
  let mustNot: Record<any, any>[] = [];
  if (docType !== undefined)
    must = [...must, { term: { '_docType.keyword': docType } }];
  if (search && search.searchString !== '')
    must = [
      ...must,
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
    must = [...must, { range: { _modified: { gte: 'now-1w' } } }];
  if (search?.filter === 'valid' || filter === 'valid')
    mustNot = [
      ...mustNot,
      { exists: { field: '_warnings' } },
      { exists: { field: '_errors' } },
    ];
  if (search?.filter === 'warning' || filter === 'warning')
    must = [...must, { exists: { field: '_warnings' } }];
  if (search?.filter === 'error' || filter === 'error')
    must = [...must, { exists: { field: '_errors' } }];
  const params: RequestParams.Count = {
    index,
    body: {
      query: { bool: { must, must_not: mustNot } },
    },
  };
  let count = -1;
  const response = await client.count(params);
  if (response && response.body && response.body.count >= 0)
    count = response.body.count as number;
  return count;
};
