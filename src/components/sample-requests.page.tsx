import React, { FunctionComponent } from 'react';
import { List, Input, Grid, Button, Icon } from 'semantic-ui-react';
import ListItemHistoryPushLink from './list.item.history-push.link';
import { coreIcon } from '../stores/items';

const SampleRequestsPage: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Items ..."
        style={{ margin: '1rem 0' }}
      />
      <Grid style={{ marginBottom: '.5rem' }}>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="plus" /> Create
          </Button>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="file excel" /> Import
          </Button>
        </Grid.Column>
      </Grid>
      <ListItemHistoryPushLink
        path="Core Sample Requests"
        title="Core Sample Requests"
        icon={coreIcon}
      >
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Rock Sample Requests"
        title="Rock Sample Requests"
        icon="shopping basket"
      >
        Description
      </ListItemHistoryPushLink>
    </List>
  );
};

export default SampleRequestsPage;
