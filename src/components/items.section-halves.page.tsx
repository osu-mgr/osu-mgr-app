import React, { FunctionComponent } from 'react';
import { List, Input, Button, Icon, Grid } from 'semantic-ui-react';
import ItemsHalfCoreModal from './items.section-half.modal';

const ItemsSectionHalvesPage: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Section Halves ..."
        style={{ margin: '1rem 0' }}
      />
      <Grid style={{ marginBottom: '.5rem' }}>
        <Grid.Column width={8}>
          <ItemsHalfCoreModal>
            <Button primary fluid icon>
              <Icon name="plus" /> Create
            </Button>
          </ItemsHalfCoreModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="file excel" /> Export
          </Button>
        </Grid.Column>
      </Grid>
    </List>
  );
};

export default ItemsSectionHalvesPage;
