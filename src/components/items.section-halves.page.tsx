import _ from 'lodash';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Button, Icon, Grid } from 'semantic-ui-react';
import ItemsSectionHalfModal from './items.section-half.modal';
import { loginState, itemsSearchState, sectionHalfIcon } from '../stores/items';
import { countByType } from '../es';
import ItemsSearchBar from './items.search-bar';
import ItemsCount from './items.count';
import ItemFilterLabels from './items.filter-labels';
import ItemsItemRow from './items.item-row';
import ItemsRowsBlock from './items.item-rows-block';

const ItemsSectionHalvesPage: FunctionComponent = () => {
  const login = useRecoilValue(loginState);
  const search = useRecoilValue(itemsSearchState);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    setItemsCount(undefined);
    (async () => {
      setItemsCount(await countByType('sectionHalf', search));
    })();
  }, [search]);
  return (
    <>
      <List relaxed divided>
        <ItemsSearchBar plural="Section Halves" sortable />
        <Grid style={{ marginBottom: 0 }} columns={2}>
          <Grid.Column>
            <ItemsSectionHalfModal>
              <Button
                primary
                fluid
                icon
                disabled={!login || !login._permissions?.includes('edit_items')}
              >
                <Icon name="plus" /> Create
              </Button>
            </ItemsSectionHalfModal>
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
                name={sectionHalfIcon}
                style={{ padding: 0, minWidth: '2.5rem' }}
              />
            </Icon.Group>
          </List.Content>
          <List.Content style={{ marginLeft: '3.75rem' }}>
            <h3 style={{ margin: 0 }}>
              <ItemsCount
                type="sectionHalf"
                singular="Section Half"
                plural="Section Halves"
              />
            </h3>
            <List.Description style={{ marginTop: '.5rem' }}>
              <ItemFilterLabels type="sectionHalf" />
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
      {[...Array(Math.max(1, Math.ceil((itemsCount || 1) / 10))).keys()].map(
        (i) => (
          <ItemsRowsBlock
            type="sectionHalf"
            key={i}
            minRowHeight={50}
            from={i * 10}
            size={10}
            itemRow={(hit) => (
              <ItemsSectionHalfModal
                uuid={hit._source._uuid}
                key={hit._source._uuid}
              >
                <List.Item as="a" style={{ minHeight: 50 }}>
                  <ItemsItemRow
                    item={hit._source}
                    matches={hit.highlight}
                    title={hit._source._osuid}
                    labels={[
                      {
                        value: hit._source.notes,
                        detail: '',
                      },
                    ]}
                  />
                </List.Item>
              </ItemsSectionHalfModal>
            )}
          />
        )
      )}
    </>
  );
};

export default ItemsSectionHalvesPage;
