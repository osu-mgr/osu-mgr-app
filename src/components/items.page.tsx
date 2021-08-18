import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Grid, Button, Icon, SemanticICONS } from 'semantic-ui-react';
import ListItemHistoryPushLink from './list.item.history-push.link';
import ItemsSearchBar from './items.search-bar';
import ItemFilterLabels from './items.filter-labels';
import ItemsImportModal from './items.import.modal';
import ItemsCount from './items.count';
import {
  loginState,
  DocType,
  cruiseIcon,
  coreIcon,
  sectionIcon,
  sectionHalfIcon,
  sectionSampleIcon,
  diveIcon,
  diveSampleIcon,
  diveSubsampleIcon,
} from '../stores/items';

const ListItemCounts: FunctionComponent<{
  icon: SemanticICONS;
  type: DocType;
  singular: string;
  plural: string;
  disabled?: boolean;
}> = ({ icon, type, singular, plural, disabled }) => {
  return (
    <ListItemHistoryPushLink
      path={plural}
      title={<ItemsCount type={type} singular={singular} plural={plural} />}
      icon={icon}
      disabled={disabled}
    >
      <ItemFilterLabels type={type} />
    </ListItemHistoryPushLink>
  );
};

const ItemsPage: FunctionComponent = () => {
  const login = useRecoilValue(loginState);
  return (
    <List relaxed divided>
      <ItemsSearchBar plural="Items" />
      <Grid style={{ marginBottom: 0 }}>
        <Grid.Column width={8}>
          <ItemsImportModal>
            <Button
              primary
              icon
              fluid
              disabled={!login || !login._permissions?.includes('import_items')}
            >
              <Icon.Group>
                <Icon name="file excel outline" />
                <Icon corner name="chevron circle up" />
              </Icon.Group>{' '}
              Import
            </Button>
          </ItemsImportModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid disabled>
            <Icon.Group>
              <Icon name="file excel outline" />
              <Icon corner name="chevron circle down" />
            </Icon.Group>{' '}
            Export
          </Button>
        </Grid.Column>
      </Grid>
      <List.Item>
        <List.Content floated="left">
          <Icon.Group size="big">
            <Icon
              name="list layout"
              style={{ padding: 0, minWidth: '2.5rem' }}
            />
          </Icon.Group>
        </List.Content>
        <List.Content style={{ marginLeft: '3.75rem' }}>
          <h3 style={{ margin: 0 }}>
            <ItemsCount singular="Item" plural="Items" />
          </h3>
          <List.Description style={{ marginTop: '.5rem' }}>
            <ItemFilterLabels />
          </List.Description>
        </List.Content>
      </List.Item>
      <ListItemCounts
        icon={cruiseIcon}
        type="cruise"
        singular="Cruise/Program"
        plural="Cruises/Programs"
      />
      <ListItemCounts
        icon={coreIcon}
        type="core"
        singular="Core"
        plural="Cores"
      />
      <ListItemCounts
        icon={sectionIcon}
        type="section"
        singular="Section"
        plural="Sections"
      />
      <ListItemCounts
        icon={sectionHalfIcon}
        type="sectionHalf"
        singular="Section Half"
        plural="Section Halves"
      />
      <ListItemCounts
        icon={sectionSampleIcon}
        type="sectionSample"
        singular="Section Sample"
        plural="Section Samples"
        disabled
      />
      <ListItemCounts
        icon={diveIcon}
        type="dive"
        singular="Dive"
        plural="Dives"
      />
      <ListItemCounts
        icon={diveSampleIcon}
        type="diveSample"
        singular="Dive Sample"
        plural="Dive Samples"
      />
      <ListItemCounts
        icon={diveSubsampleIcon}
        type="diveSubsample"
        singular="Dive Subsample"
        plural="Dive Subsamples"
        disabled
      />
    </List>
  );
};

export default ItemsPage;
