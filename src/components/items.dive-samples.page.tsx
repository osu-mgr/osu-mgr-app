import _ from 'lodash';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Grid, Button, Icon } from 'semantic-ui-react';
import ItemsDiveSampleModal from './items.dive-sample.modal';
import { loginState, itemsSearchState, diveSampleIcon } from '../stores/items';
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
      setItemsCount(await countByType('diveSample', search));
    })();
  }, [search]);
  return (
    <>
      <List relaxed divided>
        <ItemsSearchBar plural="Dive Samples" sortable />
        <Grid style={{ marginBottom: 0 }} columns={2}>
          <Grid.Column>
            <ItemsDiveSampleModal>
              <Button
                primary
                fluid
                icon
                disabled={!login || !login._permissions?.includes('edit_items')}
              >
                <Icon name="plus" /> Create
              </Button>
            </ItemsDiveSampleModal>
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
                name={diveSampleIcon}
                style={{ padding: 0, minWidth: '2.5rem' }}
              />
            </Icon.Group>
          </List.Content>
          <List.Content style={{ marginLeft: '3.75rem' }}>
            <h3 style={{ margin: 0 }}>
              <ItemsCount
                type="diveSample"
                singular="Dive Sample"
                plural="Dive Samples"
              />
            </h3>
            <List.Description style={{ marginTop: '.5rem' }}>
              <ItemFilterLabels type="diveSample" />
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
      {[...Array(Math.max(1, Math.ceil((itemsCount || 1) / 10))).keys()].map(
        (i) => (
          <ItemsRowsBlock
            type="diveSample"
            key={i}
            minRowHeight={50}
            from={i * 10}
            size={10}
            itemRow={(hit) => (
              <ItemsDiveSampleModal
                uuid={hit._source._uuid}
                key={hit._source._uuid}
              >
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
              </ItemsDiveSampleModal>
            )}
          />
        )
      )}
    </>
  );
};

export default ItemsCores;
