import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Input, Grid, Button, Icon } from 'semantic-ui-react';
import ItemsDiveModal from './items.dive.modal';
import { divesState } from '../stores/items';
import OSUID from './osu.id';

const ItemsDivesPage: FunctionComponent = () => {
  const dives = useRecoilValue(divesState);
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Dives ..."
        style={{ margin: '1rem 0' }}
      />
      <Grid style={{ marginBottom: '.5rem' }}>
        <Grid.Column width={8}>
          <ItemsDiveModal>
            <Button primary fluid icon>
              <Icon name="plus" /> Create
            </Button>
          </ItemsDiveModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="file excel" /> Export
          </Button>
        </Grid.Column>
      </Grid>
      {_.keys(dives).map((key) => (
        <ItemsDiveModal uuID={key} key={key}>
          <List.Item as="a">
            <b>
              <OSUID uuIDs={{ dive: key }} />
            </b>
          </List.Item>
        </ItemsDiveModal>
      ))}
    </List>
  );
};

export default ItemsDivesPage;
