import _ from 'lodash';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Grid, Button, Icon } from 'semantic-ui-react';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import ItemsDiveModal from './items.dive.modal';
import { loginState, itemsSearchState, diveIcon } from '../stores/items';
import { countByType } from '../es';
import ItemsSearchBar from './items.search-bar';
import ItemsCount from './items.count';
import ItemFilterLabels from './items.filter-labels';
import ItemsItemRow from './items.item-row';
import ItemsRowsBlock from './items.item-rows-block';

const ItemsCores: FunctionComponent = () => {
  const login = useRecoilValue(loginState);
  const search = useRecoilValue(itemsSearchState);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    setItemsCount(undefined);
    (async () => {
      setItemsCount(await countByType('dive', search));
    })();
  }, [search]);
  return (
    <>
      <List relaxed divided>
        <ItemsSearchBar plural="Dives" sortable />
        <Grid style={{ marginBottom: 0 }} columns={2}>
          <Grid.Column>
            <ItemsCruiseProgramModal>
              <Button
                primary
                fluid
                icon
                disabled={!login || !login._permissions?.includes('edit_items')}
              >
                <Icon name="plus" /> Create
              </Button>
            </ItemsCruiseProgramModal>
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
                name={diveIcon}
                style={{ padding: 0, minWidth: '2.5rem' }}
              />
            </Icon.Group>
          </List.Content>
          <List.Content style={{ marginLeft: '3.75rem' }}>
            <h3 style={{ margin: 0 }}>
              <ItemsCount type="dive" singular="Dive" plural="Dives" />
            </h3>
            <List.Description style={{ marginTop: '.5rem' }}>
              <ItemFilterLabels type="dive" />
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
      {[...Array(Math.max(1, Math.ceil((itemsCount || 1) / 10))).keys()].map(
        (i) => (
          <ItemsRowsBlock
            type="dive"
            key={i}
            minRowHeight={50}
            from={i * 10}
            size={10}
            itemRow={(hit) => (
              <ItemsDiveModal uuid={hit._source._uuid} key={hit._source._uuid}>
                <List.Item as="a" style={{ minHeight: 50 }}>
                  <ItemsItemRow
                    item={hit._source}
                    matches={hit.highlight}
                    title={hit._source._osuid}
                    labels={[
                      { value: hit._source.texture, detail: '' },
                      { value: hit._source.description, detail: '' },
                      { value: hit._source.habitat, detail: '' },
                      { value: hit._source.comments, detail: '' },
                    ]}
                  />
                </List.Item>
              </ItemsDiveModal>
            )}
          />
        )
      )}
    </>
  );
};

export default ItemsCores;
