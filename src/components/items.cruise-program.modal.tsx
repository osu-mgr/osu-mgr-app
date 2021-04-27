import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Icon, Form } from 'semantic-ui-react';
import Modal from './modal';
import FormGridColumns from './form.grid.columns';
// eslint-disable-next-line import/no-cycle
import ItemsDiveModal from './items.dive.modal';
import OSUID from './osu.id';
import {
  cruisesState,
  Cruise,
  cruiseIcon,
  coresState,
  divesState,
} from '../stores/items';

const ItemsCruiseProgramModal: FunctionComponent<{
  uuID?: string;
}> = ({ children, uuID }) => {
  const cruises = useRecoilValue(cruisesState);
  const cores = useRecoilValue(coresState);
  const dives = useRecoilValue(divesState);
  const cruise: Cruise | undefined = (uuID && cruises[uuID]) || undefined;
  return (
    <Modal
      trigger={children}
      icon={cruiseIcon}
      title="Cruise/Program"
      buttons={() => (
        <>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
        </>
      )}
    >
      <Form>
        <Form.Input
          fluid
          label="Cruise/Program ID"
          placeholder="Required"
          error={cruise?.id === ''}
          defaultValue={cruise?.id}
          onChange={(e) => console.log(e)}
        />
        <Form.Input
          fluid
          label="OSU ID"
          placeholder="Calculated"
          value={cruise?.id !== '' && `OSU-${cruise?.id}`}
        />
        <Form.Input fluid label="Cruise/Program Notes" />
        <Form.Input
          fluid
          label="Cruise/Program Name"
          value={cruise?.name || ''}
        />
        <Form.Input fluid label="RV Name" value={cruise?.rvName || ''} />
        <Form.Field style={{ marginBottom: 0 }}>
          <label>Cores</label>
        </Form.Field>
        {/* cruise?.cores.map(x =>
						<FormGridColumns key={ x } widths={ [2, 12, 2] }>
							<ItemsDeploymentDiveModal>
								<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='edit'/></Button>
							</ItemsDeploymentDiveModal>
							<OSUID as='input' uuIDs={{ core: x }}/>
							<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='delete'/></Button>
						</FormGridColumns>
					) */}
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            multiple
            search
            renderLabel={({ value }) => `${value}`}
            options={_.keys(cores).map((x) => {
              return {
                key: x,
                value: x,
                text: <OSUID uuIDs={{ core: x }} />,
              };
            })}
          />
          <ItemsDiveModal>
            <Button primary fluid icon style={{ marginBottom: 2 }}>
              <Icon name="plus" />
            </Button>
          </ItemsDiveModal>
        </FormGridColumns>
        <Form.Field style={{ marginBottom: 0 }}>
          <label>Dives</label>
        </Form.Field>
        {/* cruise?.dives.map(x =>
						<FormGridColumns key={ x } widths={ [2, 12, 2] }>
							<ItemsDiveModal>
								<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='edit'/></Button>
							</ItemsDiveModal>
							<OSUID as='input' uuIDs={{ dive: x }}/>
							<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='delete'/></Button>
						</FormGridColumns>
					) */}
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            multiple
            search
            renderLabel={({ value }) => `${value}`}
            options={_.keys(dives).map((x) => {
              return {
                key: x,
                value: x,
                text: <OSUID uuIDs={{ dive: x }} />,
              };
            })}
          />
          <Button primary fluid icon style={{ marginBottom: 2 }}>
            <Icon name="plus" />
          </Button>
        </FormGridColumns>
      </Form>
    </Modal>
  );
};

export default ItemsCruiseProgramModal;
