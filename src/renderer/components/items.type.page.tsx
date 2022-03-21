import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useInView } from 'react-hook-inview';
import { List, Button, Icon, Grid } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import ItemsCoreModal from './items.core.modal';
import ItemsSectionModal from './items.section.modal';
import ItemsSectionHalfModal from './items.section-half.modal';
import ItemsSectionSampleModal from './items.section-sample.modal';
import ItemsDiveModal from './items.dive.modal';
import ItemsDiveSampleModal from './items.dive-sample.modal';
import ItemsDiveSubsampleModal from './items.dive-subsample.modal';
import {
  ItemType,
  itemTypesSingular,
  itemTypesPlural,
  itemTypesIcon,
  itemsSearchState,
} from '../stores/items';
import { loginState } from '../stores/accounts';
import { countByType } from '../common/es';
import ItemsSearchBar from './items.search-bar';
import ItemsCount from './items.count';
import ItemFilterLabels from './items.filter-labels';
import ItemsItemRow from './items.item-row';
import ItemsRowsBlock from './items.item-rows-block';

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
  type: ItemType;
}> = ({ type }) => {
  const isMounted = useMountedState();
  const login = useRecoilValue(loginState);
  const search = useRecoilValue(itemsSearchState);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const [maxPages, setMaxPages] = useState<number>(1);
  const ItemsTypeModal = itemTypesModal[type];
  const pageSize = 10;

  useEffect(() => {
    setItemsCount(undefined);
    if (isMounted())
      (async () => {
        const update = await countByType(type, search);
        if (isMounted()) setItemsCount(update);
      })();
  }, [isMounted, type, search]);
  useEffect(() => {
    if (
      isMounted() &&
      isVisible &&
      itemsCount &&
      itemsCount / pageSize > maxPages
    )
      setMaxPages(maxPages + 1);
  }, [isMounted, isVisible, itemsCount, maxPages]);
  return (
    <>
      <List relaxed divided style={{ marginBottom: 0 }}>
        <ItemsSearchBar plural={itemTypesPlural[type]} sortable />
        <Grid style={{ marginBottom: 0 }} columns={2}>
          <Grid.Column>
            <ItemsTypeModal>
              <Button
                primary
                fluid
                icon
                disabled={!login || !login._permissions?.includes('edit_items')}
              >
                <Icon name="plus" /> Create
              </Button>
            </ItemsTypeModal>
          </Grid.Column>
          <Grid.Column>
            <Button primary icon fluid disabled>
              <Icon name="file excel" /> Export
            </Button>
          </Grid.Column>
        </Grid>
        <List.Item>
          <List.Content floated="left">
            <Icon.Group size="big">
              <Icon
                name={itemTypesIcon[type]}
                style={{ padding: 0, minWidth: '2.5rem' }}
              />
            </Icon.Group>
          </List.Content>
          <List.Content style={{ marginLeft: '3.75rem' }}>
            <h3 style={{ margin: 0 }}>
              <ItemsCount
                type={type}
                singular={itemTypesSingular[type]}
                plural={itemTypesPlural[type]}
              />
            </h3>
            <List.Description style={{ marginTop: '.5rem' }}>
              <ItemFilterLabels type={type} />
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
      {(itemsCount &&
        [...Array(maxPages).keys()].map((i) => (
          <ItemsRowsBlock
            type={type}
            key={i}
            minRowHeight={50}
            from={i * pageSize}
            size={pageSize}
            itemRow={(hit) => (
              <ItemsTypeModal uuid={hit._source._uuid} key={hit._source._uuid}>
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
        ))) ||
        ''}
      {itemsCount && itemsCount / pageSize > maxPages && (
        <div ref={ref} style={{ minHeight: 50 }} />
      )}
    </>
  );
};

export default ItemsTypePage;
