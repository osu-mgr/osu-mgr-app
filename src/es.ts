import _ from 'lodash';
import electron from 'electron';
import { Client, RequestParams, ApiResponse } from '@elastic/elasticsearch';

import { Item, Items } from './stores/items';

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
  node: electron.remote.process.env.ES_NODE || 'http://localhost:9200',
});
const index = electron.remote.process.env.ES_INDEX || '';
console.log('index', index);
// if (index === '') throw new Error();

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

export const searchByIGSNPrefix = async (
  igsnPrefix: string
): Promise<Hit[]> => {
  console.log('searchByIGSNPrefix', index, igsnPrefix);
  const params: RequestParams.Search = {
    size: 10000,
    index,
    body: {
      sort: [{ _modified: 'desc' }],
      query: {
        bool: {
          should: [
            { prefix: { '_igsn.keyword': `${igsnPrefix}-` } },
            { term: { '_igsn.keyword': igsnPrefix } },
          ],
        },
      },
    },
  };
  const docs: Hit[] = [];
  for await (const hit of scrollSearch(params)) {
    docs.push(hit);
  }
  console.log('searchByIGSNPrefix docs', igsnPrefix, docs);
  return docs;
};

export const countByType = async (docType: string): Promise<number> => {
  const params: RequestParams.Count = {
    index,
    body: {
      query: { term: { _docType: docType } },
    },
  };
  let count = -1;
  const response = await client.count(params);
  if (response && response.body && response.body.count >= 0)
    count = response.body.count as number;
  console.log('countByType', docType, count, response);
  return count;
};

export const searchRecent = async (gte: string): Promise<Hit[]> => {
  const params: RequestParams.Search = {
    index,
    size: 10000,
    scroll: '1m',
    body: {
      sort: [{ modified: 'desc' }],
      query: { range: { modified: { gte } } },
    },
  };
  const docs: Hit[] = [];
  for await (const hit of scrollSearch(params)) {
    docs.push(hit);
  }
  console.log('searchRecent docs', gte, docs);
  return docs;
};
