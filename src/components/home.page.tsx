import React, { FunctionComponent } from 'react';
import { List } from 'semantic-ui-react';
import OSUMGRLogo from '../static/Website Logo-2020.svg';
import ListItemHistoryPushLink from './list.item.history-push.link';

const HomePage: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <img
        alt="OSU MGR Logo"
        src={OSUMGRLogo}
        style={{
          display: 'block',
          width: '30rem',
          margin: '1rem auto',
        }}
      />
      <ListItemHistoryPushLink path="Items" title="Items" icon="list layout">
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Sample Requests"
        title="Sample Requests"
        icon="clipboard list"
      >
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink path="Storage" title="Storage" icon="warehouse">
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink path="Moves" title="Moves" icon="truck">
        Description
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink path="Reports" title="Reports" icon="chart pie">
        Description
      </ListItemHistoryPushLink>
    </List>
  );
};

export default HomePage;
