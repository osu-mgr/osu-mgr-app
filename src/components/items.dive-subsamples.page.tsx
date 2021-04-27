import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Input } from 'semantic-ui-react';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import { diveSubsamplesState } from '../stores/items';
import OSUID from './osu.id';

const ItemsDiveSubsamples: FunctionComponent = () => {
  const diveSubsamples = useRecoilValue(diveSubsamplesState);
  return (
    <List relaxed divided>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search Dive Subsamples ..."
        style={{ margin: '1rem 0' }}
      />
      {_.keys(diveSubsamples).map((key) => (
        <ItemsCruiseProgramModal uuID={key} key={key}>
          <List.Item as="a">
            <b>
              <OSUID uuIDs={{ diveSubsample: key }} />
            </b>
          </List.Item>
        </ItemsCruiseProgramModal>
      ))}
    </List>
  );
};

export default ItemsDiveSubsamples;
