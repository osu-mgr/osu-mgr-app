import React, { FunctionComponent } from 'react';
import { List, Input } from 'semantic-ui-react';

const ItemsDiveSamples: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Dive Samples ..."
        style={{ margin: '1rem 0' }}
      />
    </List>
  );
};

export default ItemsDiveSamples;
