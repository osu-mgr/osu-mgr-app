import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { List, Input, Grid, Button, Icon, Label } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import ListItemHistoryPushLink from './list.item.history-push.link';
import ItemsImportModal from './items.import.modal';
import {
  cruisesState,
  cruiseIcon,
  coresState,
  coreIcon,
  sectionsState,
  sectionIcon,
  sectionHalvesState,
  sectionHalfIcon,
  sectionSamplesState,
  sectionSampleIcon,
  divesState,
  diveIcon,
  diveSamplesState,
  diveSampleIcon,
  diveSubsamplesState,
  diveSubsampleIcon,
} from '../stores/items';

const ItemsPage: FunctionComponent = () => {
  const cruises = useRecoilValue(cruisesState);
  const cores = useRecoilValue(coresState);
  const sections = useRecoilValue(sectionsState);
  const sectionHalves = useRecoilValue(sectionHalvesState);
  const sectionSamples = useRecoilValue(sectionSamplesState);
  const dives = useRecoilValue(divesState);
  const diveSamples = useRecoilValue(diveSamplesState);
  const diveSubsamples = useRecoilValue(diveSubsamplesState);
  console.log('cruises', cruises);
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
          <ItemsImportModal>
            <Button primary icon fluid>
              <Icon.Group>
                <Icon name="file excel outline" />
                <Icon corner name="chevron circle up" />
              </Icon.Group>{' '}
              Import
            </Button>
          </ItemsImportModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon.Group>
              <Icon name="file excel outline" />
              <Icon corner name="chevron circle down" />
            </Icon.Group>{' '}
            Export
          </Button>
        </Grid.Column>
      </Grid>
      <ListItemHistoryPushLink
        path="Cruises/Programs"
        title="Cruises/Programs"
        icon={cruiseIcon}
      >
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(cruises).length} Recent Change
          {_.keys(cruises).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(cruises).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink path="Cores" title="Cores" icon={coreIcon}>
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(cores).length} Recent Change
          {_.keys(cores).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(cores).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Sections"
        title="Sections"
        icon={sectionIcon}
      >
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(sections).length} Recent Change
          {_.keys(sections).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(sections).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Section Halves"
        title="Section Halves"
        icon={sectionHalfIcon}
      >
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(sectionHalves).length} Recent Change
          {_.keys(sectionHalves).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(sectionHalves).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Section Samples"
        title="Section Samples"
        icon={sectionSampleIcon}
      >
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(sectionSamples).length} Recent Change
          {_.keys(sectionSamples).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(sectionSamples).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink path="Dives" title="Dives" icon={diveIcon}>
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(dives).length} Recent Change
          {_.keys(dives).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(dives).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Dive Samples"
        title="Dive Samples"
        icon={diveSampleIcon}
      >
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(diveSamples).length} Recent Change
          {_.keys(diveSamples).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(diveSamples).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
      <ListItemHistoryPushLink
        path="Dive Subsamples"
        title="Dive Subsamples"
        icon={diveSubsampleIcon}
      >
        <Label
          size="tiny"
          style={{ color: 'rgba(0, 0, 0, 0.75)', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="add circle" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
          {_.keys(diveSubsamples).length} Recent Change
          {_.keys(cruises).length !== 1 && 's'}
        </Label>
        <Label
          size="tiny"
          style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="check circle" style={{ color: '#2C662D' }} />
          {_.keys(diveSubsamples).length} Valid
        </Label>
        <Label
          size="tiny"
          style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
          {0} Warnings
        </Label>
        <Label
          size="tiny"
          style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        >
          <Icon name="times circle" style={{ color: '#9F3A38' }} />
          {0} Errors
        </Label>
      </ListItemHistoryPushLink>
    </List>
  );
};

export default ItemsPage;
