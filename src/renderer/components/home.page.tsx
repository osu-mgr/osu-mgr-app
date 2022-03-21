import { FunctionComponent } from 'react';
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
        Manage Repository Cruises/Programs to Subsamples
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Sample Requests"
        title="Sample Requests"
        icon="clipboard list"
        disabled
      >
        Manage Sample Requests
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Storage Locations"
        title="Storage Locations"
        icon="warehouse"
      >
        Explore Physical Locations of Repository Items
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink path="Moves" title="Moves" icon="truck" disabled>
        Coordinate Item Movement Outside Repository
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Reports"
        title="Reports"
        icon="chart pie"
        disabled
      >
        View Repository Reports
      </ListItemHistoryPushLink>
    </List>
  );
};

export default HomePage;
