import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Input, Button, Icon, Grid } from 'semantic-ui-react';
import ItemsSectionModal from './items.section.modal';
import { sectionsState } from '../stores/items';
import OSUID from './osu.id';

const ItemsSectionsPage: FunctionComponent = () => {
  const sections = useRecoilValue(sectionsState);
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Sections ..."
        style={{ margin: '1rem 0' }}
      />
      <Grid style={{ marginBottom: '.5rem' }}>
        <Grid.Column width={8}>
          <ItemsSectionModal>
            <Button primary fluid icon>
              <Icon name="plus" /> Create
            </Button>
          </ItemsSectionModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="file excel" /> Export
          </Button>
        </Grid.Column>
      </Grid>
      {_.keys(sections).map((key) => (
        <ItemsSectionModal uuID={key} key={key}>
          <List.Item as="a">
            <b>
              <OSUID uuIDs={{ section: key }} />
            </b>
          </List.Item>
        </ItemsSectionModal>
      ))}
    </List>
  );
};

export default ItemsSectionsPage;
