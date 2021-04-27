import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Input, Grid, Button, Icon } from 'semantic-ui-react';
import ItemsCoreModal from './items.core.modal';
import { coresState } from '../stores/items';
import OSUID from './osu.id';

const ItemsCores: FunctionComponent = () => {
  const cores = useRecoilValue(coresState);
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Cores ..."
        style={{ margin: '1rem 0' }}
      />
      <Grid style={{ marginBottom: '.5rem' }}>
        <Grid.Column width={8}>
          <ItemsCoreModal>
            <Button primary fluid icon>
              <Icon name="plus" /> Create
            </Button>
          </ItemsCoreModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="file excel" /> Export
          </Button>
        </Grid.Column>
      </Grid>
      {_.keys(cores).map((key) => (
        <ItemsCoreModal uuID={key} key={key}>
          <List.Item as="a">
            <b>
              <OSUID uuIDs={{ core: key }} />
            </b>
          </List.Item>
        </ItemsCoreModal>
      ))}
    </List>
  );
};

export default ItemsCores;
