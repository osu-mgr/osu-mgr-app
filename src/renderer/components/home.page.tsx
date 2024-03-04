import { FunctionComponent } from 'react';
import { List } from 'semantic-ui-react';
import OSUMGRLogo from '../static/Website Logo-2020.svg';
import OSUMGRSticker from '../static/marine&geology_sticker_final.png';
import ListItemHistoryPushLink from './list.item.history-push.link';

const HomePage: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <img
        alt="OSU MGR Sticker"
        src={OSUMGRSticker}
        style={{
          display: 'block',
          width: '10rem',
          margin: '1rem auto',
        }}
      />
      <img
        alt="OSU MGR Logo"
        src={OSUMGRLogo}
        style={{
          display: 'block',
          width: '30rem',
          margin: '1rem auto',
        }}
      />
      <ListItemHistoryPushLink
        path="Item Types"
        title="Item Types"
        icon="list layout"
      >
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
      <ListItemHistoryPushLink
        path="File Monitoring"
        title="File Monitoring"
        icon="folder"
        disabled
      >
        Detect Changes and Import Files
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
