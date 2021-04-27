import React, { FunctionComponent } from 'react';
import { List, Input, Button, Icon, Grid } from 'semantic-ui-react';
import ItemsSectionModal from './items.section.modal';

const ItemsSectionSamplesPage: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Section Samples ..."
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
    </List>
  );
};

export default ItemsSectionSamplesPage;
