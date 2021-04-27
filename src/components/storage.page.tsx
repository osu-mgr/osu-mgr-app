import React, { FunctionComponent } from 'react';
import { List, Input } from 'semantic-ui-react';
import ListItemHistoryPushLink from './list.item.history-push.link';

const Storage: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Storage ..."
        style={{ margin: '1rem 0' }}
      />
      <ListItemHistoryPushLink
        path="Dry West"
        title="Dry West"
        icon="sun"
        cornerIcon="chevron circle left"
      >
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Dry East"
        title="Dry East"
        icon="sun"
        cornerIcon="chevron circle right"
      >
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Cold West"
        title="Cold West"
        icon="thermometer half"
        cornerIcon="chevron circle left"
      >
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Cold East"
        title="Cold East"
        icon="thermometer half"
        cornerIcon="chevron circle right"
      >
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Ice Cores Freezer"
        title="Ice Cores Freezer"
        icon="snowflake"
        cornerIcon="chevron circle left"
      >
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Sediment Freezer"
        title="Sediment Freezer"
        icon="snowflake"
        cornerIcon="chevron circle right"
      >
        Description
      </ListItemHistoryPushLink>
    </List>
  );
};

export default Storage;
