import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Input, Button, Icon, Grid, Dropdown } from 'semantic-ui-react';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import { cruisesState } from '../stores/items';
import OSUID from './osu.id';

const ItemsCruisesProgramsPage: FunctionComponent = () => {
  const cruises = useRecoilValue(cruisesState);
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Cruises and Programs ..."
        style={{ margin: '1rem 0' }}
        action={
          <Dropdown
            button
            options={[
              {
                key: 'modified desc',
                value: 'modified desc',
                text: (
                  <>
                    <Icon name="long arrow alternate down" /> Modified
                  </>
                ),
              },
              {
                key: 'modified asc',
                value: 'modified asc',
                text: (
                  <>
                    <Icon name="long arrow alternate up" /> Modified
                  </>
                ),
              },
            ]}
            value="modified desc"
          />
        }
      />
      <Grid style={{ marginBottom: '.5rem' }}>
        <Grid.Column width={8}>
          <ItemsCruiseProgramModal>
            <Button primary fluid icon>
              <Icon name="plus" /> Create
            </Button>
          </ItemsCruiseProgramModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid>
            <Icon name="file excel" /> Export
          </Button>
        </Grid.Column>
      </Grid>
      {_.keys(cruises).map((key) => (
        <ItemsCruiseProgramModal uuID={key} key={key}>
          <List.Item as="a">
            <b>
              <OSUID uuIDs={{ cruise: key }} />
            </b>{' '}
            {cruises[key].name}
          </List.Item>
        </ItemsCruiseProgramModal>
      ))}
    </List>
  );
};

export default ItemsCruisesProgramsPage;
