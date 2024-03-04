import _ from 'lodash';
import { FunctionComponent, useState, useCallback, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useInView } from 'react-hook-inview';
import {
  Input,
  List,
  Button,
  ButtonGroup,
  Icon,
  Dropdown,
  Grid,
} from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import ItemsCoreModal from './items.core.modal';
import ItemsSectionModal from './items.section.modal';
import ItemsSectionHalfModal from './items.section-half.modal';
import ItemsSectionSampleModal from './items.section-sample.modal';
import ItemsDiveModal from './items.dive.modal';
import ItemsDiveSampleModal from './items.dive-sample.modal';
import ItemsDiveSubsampleModal from './items.dive-subsample.modal';
import ItemFilterLabels from './items.filter-labels';
import ListItemHistoryPushLink from './list.item.history-push.link';
import PageScroll from './page-scroll';
import {
  ItemType,
  ItemsSearch,
  itemTypes,
  itemTypesSingular,
  itemTypesPlural,
  itemTypesIcon,
  itemsSearchState,
} from '../stores/items';
import { loginState } from '../stores/accounts';
import { countByType, indexDocs, scrollSearch } from '../common/es';
import ItemsCount from './items.count';
import ItemsImportModal from './items.import.modal';
import ItemsItemRow from './items.item-row';
import ItemsRowsBlock from './items.item-rows-block';
import validateItem from '../common/validateItem';

let validated = false;
const runValidation = () => {
  console.log('Validate?');
  if (!validated) {
    validated = true;
    (async () => {
      let i = 0;
      console.log('Validating batch of items...');
      const params = {
        size: 10000,
        index: 'osu-mgr-8',
        body: {
          query: {
            bool: {
              must_not: [
                {
                  term: { '_docType.keyword': 'account' },
                },
              ],
              filter: {
                script: {
                  script:
                    "doc['_validated'].empty || (doc['_validated'].value.millis/1000 < doc['_modified'].value.millis/1000)",
                },
              },
            },
          },
        },
      };
      let validatedItems = {};
      for await (const hit of scrollSearch(params)) {
        i += 1;
        validatedItems[hit._id] = validateItem(hit._source);
        if (i % 1000 === 0) {
          await indexDocs(Object.values(validatedItems));
          console.log('Validating...', i);
          validatedItems = {};
        }
      }
      if (Object.keys(validatedItems).length > 0)
        await indexDocs(Object.values(validatedItems));
      if (i > 0) {
        console.log(`Validated ${i} items.`);
        validated = false;
        runValidation();
      }
    })();
  }
};

const ItemsSearchBar: FunctionComponent<{
  plural: string;
  sortable?: boolean;
  margin?: string;
}> = ({ plural, sortable, margin = '1rem 0' }) => {
  const [search, setSearch] = useRecoilState(itemsSearchState);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  const [searchString, setSearchString] = useState(search.searchString);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((x: string) => {
      x = x.replace(/^http(s?):\/\/osu-mgr.org\//i, '');
      setSearch({ ...search, searchString: x });
    }, 500),
    [setSearch, search]
  );
  useEffect(() => {
    if (!isVisible) setSearchString(search.searchString);
  }, [isVisible, search]);
  return (
    <Input
      fluid
      iconPosition="left"
      placeholder={`Search ${plural} ...`}
      style={{ margin }}
      value={searchString}
      onChange={(_event, data) => {
        setSearchString(data.value);
        debounce(data.value);
      }}
      action
    >
      <Icon name="search" />
      <input ref={ref} />
      <Button
        basic={searchString !== ''}
        icon="close"
        disabled={searchString === ''}
        onClick={() => {
          setSearch({ ...search, searchString: '' });
          setSearchString('');
        }}
      />
      {sortable && (
        <Dropdown
          button
          options={[
            {
              key: 'ids asc',
              value: 'ids asc',
              text: 'Names (Ordered)',
            },
            {
              key: 'ids desc',
              value: 'ids desc',
              text: 'Names (Reverse)',
            },
            {
              key: 'alpha asc',
              value: 'alpha asc',
              text: 'IDs (Ordered)',
            },
            {
              key: 'alpha desc',
              value: 'alpha desc',
              text: 'IDs (Reverse)',
            },
            {
              key: 'modified desc',
              value: 'modified desc',
              text: 'Recent First',
            },
            {
              key: 'modified asc',
              value: 'modified asc',
              text: 'Recent Last',
            },
          ]}
          value={search.sortOrder}
          onChange={(_event, data) =>
            setSearch({
              ...search,
              sortOrder: data.value as ItemsSearch['sortOrder'],
            })
          }
        />
      )}
    </Input>
  );
};

const itemTypesModal: Record<
  ItemType,
  FunctionComponent<{
    uuid?: string;
  }>
> = {
  cruise: ItemsCruiseProgramModal,
  core: ItemsCoreModal,
  section: ItemsSectionModal,
  sectionHalf: ItemsSectionHalfModal,
  sectionSample: ItemsSectionSampleModal,
  dive: ItemsDiveModal,
  diveSample: ItemsDiveSampleModal,
  diveSubsample: ItemsDiveSubsampleModal,
};

const ItemsTypePage: FunctionComponent<{
  type?: ItemType;
}> = ({ type }) => {
  const isMounted = useMountedState();
  const login = useRecoilValue(loginState);
  const [search, setSearch] = useRecoilState(itemsSearchState);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const ItemsTypeModal = (type && itemTypesModal[type]) || undefined;

  useEffect(() => {
    setItemsCount(undefined);
    if (isMounted())
      (async () => {
        const update = await countByType(type, search);
        if (isMounted()) setItemsCount(update);
      })();
  }, [isMounted, type, search]);

  runValidation();

  return (
    <>
      <ItemsSearchBar
        plural={(type && itemTypesPlural[type]) || 'Items'}
        sortable={type !== undefined}
      />
      <Grid style={{ marginBottom: 0 }} columns={2}>
        <Grid.Column>
          {ItemsTypeModal ? (
            <ItemsTypeModal>
              <Button
                primary
                icon
                fluid
                size="mini"
                disabled={!login || !login._permissions?.includes('edit_items')}
              >
                <Icon name="plus" /> Create
              </Button>
            </ItemsTypeModal>
          ) : (
            <ItemsImportModal>
              <Button
                primary
                icon
                fluid
                size="mini"
                disabled={
                  !login || !login._permissions?.includes('import_items')
                }
              >
                <Icon.Group>
                  <Icon name="file excel outline" />
                  <Icon corner name="chevron circle up" />
                </Icon.Group>{' '}
                Import
              </Button>
            </ItemsImportModal>
          )}
        </Grid.Column>
        <Grid.Column>
          <Button primary icon fluid size="mini" disabled>
            <Icon name="file excel" /> Export
          </Button>
        </Grid.Column>
      </Grid>
      <ButtonGroup fluid size="mini">
        <Button
          size="mini"
          primary={search.filter == 'recent'}
          style={{
            color: search.filter == 'recent' ? 'white' : 'rgba(0, 0, 0, 0.75)',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'recent' ? undefined : 'recent',
            });
          }}
        >
          <Icon
            name="edit"
            style={{
              color:
                search.filter == 'recent' ? 'white' : 'rgba(0, 0, 0, 0.75)',
            }}
          />
          <Icon
            name="close"
            style={{
              float: 'right',
              marginRight: '-0.5em',
              color: 'white',
              visibility: search.filter == 'recent' ? 'visible' : 'hidden',
            }}
          />
          <ItemsCount
            type={type}
            label="Recents"
            filter="recent"
            inverted={search.filter == 'recent'}
          />
        </Button>
        <Button
          size="mini"
          primary={search.filter == 'valid'}
          style={{
            color: search.filter == 'valid' ? 'white' : '#2C662D',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'valid' ? undefined : 'valid',
            });
          }}
        >
          <Icon
            name="check circle"
            style={{ color: search.filter == 'valid' ? 'white' : '#2C662D' }}
          />
          <Icon
            name="close"
            style={{
              float: 'right',
              marginRight: '-0.5em',
              color: 'white',
              visibility: search.filter == 'valid' ? 'visible' : 'hidden',
            }}
          />
          <ItemsCount
            type={type}
            label="Valid"
            filter="valid"
            inverted={search.filter == 'valid'}
          />
        </Button>
        <Button
          size="mini"
          primary={search.filter == 'warning'}
          style={{
            color: search.filter == 'warning' ? 'white' : '#F2711C',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'warning' ? undefined : 'warning',
            });
          }}
        >
          <Icon
            name="exclamation circle"
            style={{ color: search.filter == 'warning' ? 'white' : '#F2711C' }}
          />
          <Icon
            name="close"
            style={{
              float: 'right',
              marginRight: '-0.5em',
              color: 'white',
              visibility: search.filter == 'warning' ? 'visible' : 'hidden',
            }}
          />
          <ItemsCount
            type={type}
            label="Warnings"
            filter="warning"
            inverted={search.filter == 'warning'}
          />
        </Button>
        <Button
          size="mini"
          primary={search.filter == 'error'}
          style={{
            color: search.filter == 'error' ? 'white' : '#9F3A38',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'error' ? undefined : 'error',
            });
          }}
        >
          <Icon
            name="times circle"
            style={{ color: search.filter == 'error' ? 'white' : '#9F3A38' }}
          />
          <Icon
            name="close"
            style={{
              float: 'right',
              marginRight: '-0.5em',
              color: 'white',
              visibility: search.filter == 'error' ? 'visible' : 'hidden',
            }}
          />
          <ItemsCount
            type={type}
            label="Errors"
            filter="error"
            inverted={search.filter == 'error'}
          />
        </Button>
      </ButtonGroup>
      <List relaxed divided style={{ marginTop: '0.5em' }}>
        <List.Item></List.Item>
        {(!type &&
          itemTypes.map((itemType) => (
            <ListItemHistoryPushLink
              key={itemType}
              path={itemTypesPlural[itemType]}
              title={
                <ItemsCount
                  type={itemType}
                  singular={itemTypesSingular[itemType]}
                  plural={itemTypesPlural[itemType]}
                />
              }
              icon={itemTypesIcon[itemType]}
            >
              <ItemFilterLabels type={itemType} />
            </ListItemHistoryPushLink>
          ))) ||
          ''}
      </List>
      {(ItemsTypeModal && type && itemsCount && (
        <PageScroll
          pageSize={10}
          rows={[...Array(Math.ceil(itemsCount / 10)).keys()].map((i) => (
            <ItemsRowsBlock
              type={type}
              key={`${type}_${i}`}
              minRowHeight={50}
              from={i * 10}
              size={10}
              itemRow={(hit) => (
                <ItemsTypeModal
                  uuid={hit._source._uuid}
                  key={hit._source._uuid}
                >
                  <List.Item as="a" style={{ minHeight: 50 }}>
                    <ItemsItemRow
                      item={hit._source}
                      matches={hit.highlight}
                      title={hit._source._osuid}
                      labels={[
                        { label: '', value: hit._source.name },
                        {
                          label: '',
                          value: hit._source.rvName,
                        },
                      ]}
                    />
                  </List.Item>
                </ItemsTypeModal>
              )}
            />
          ))}
        />
      )) ||
        ''}
    </>
  );
};

export default ItemsTypePage;
