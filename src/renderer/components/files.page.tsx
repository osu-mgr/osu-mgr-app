import { FunctionComponent } from 'react';
import { List, Input, Grid, Button, Icon } from 'semantic-ui-react';
import ListItemHistoryPushLink from './list.item.history-push.link';
import { itemTypesIcon } from '../stores/items';

const FilesPage: FunctionComponent = () => {
  return (
    <List relaxed divided>
      <Grid style={{ marginBottom: '.5rem' }}>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="folder" /> Edit Folder Locations
          </Button>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button icon fluid>
            <Icon name="refresh" /> Refresh Results
          </Button>
        </Grid.Column>
      </Grid>
      <ListItemHistoryPushLink
        path="Meta Data Sheets"
        title="Meta Data Sheets"
        icon="file excel"
      >
        F:/Users/Core Lab/Collection/Holdings
        <br />
        F:/Users/Core Lab/Collection/ACC Holdings
      </ListItemHistoryPushLink>
    </List>
  );
};

export default FilesPage;
