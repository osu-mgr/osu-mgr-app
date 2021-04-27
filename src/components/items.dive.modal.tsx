import _ from 'lodash';
import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Icon,
  Form,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import FormGridColumns from './form.grid.columns';
import Modal from './modal';
// eslint-disable-next-line import/no-cycle
import ItemsCruiseProgramModal from './items.cruise-program.modal';
// import ItemsDiveSampleModal from './items.dive-sample.modal';
import OSUID, { calculatedOSUID } from './osu.id';
import {
  Cruise,
  cruisesState,
  divesState,
  diveIcon,
  Dive,
  diveSamplesState,
} from '../stores/items';

const ItemsDiveModalContent: FunctionComponent<{
  uuID?: string;
}> = ({ uuID }) => {
  const cruises = useRecoilValue(cruisesState);
  const dives = useRecoilValue(divesState);
  const diveSamples = useRecoilValue(diveSamplesState);
  const dive: Dive | undefined = (uuID && dives[uuID]) || undefined;
  const cruiseUUID: string | undefined =
    uuID && dives[uuID] && dives[uuID]._cruiseUUID;
  const cruise: Cruise | undefined =
    (cruiseUUID && cruises[cruiseUUID]) || undefined;
  console.log('dive', dive);
  return (
    <Form>
      <FormGridColumns widths={[2, 12, 2]}>
        <ItemsCruiseProgramModal uuID={cruiseUUID}>
          <Button
            primary
            fluid
            icon
            style={{ marginBottom: 2 }}
            disabled={!cruiseUUID}
          >
            <Icon name="edit" />
          </Button>
        </ItemsCruiseProgramModal>
        <Form.Select
          fluid
          search
          selection
          label="Cruise/Program"
          placeholder="Required"
          error={!dive?.cruise}
          value={dive?.cruise || ''}
          options={_.keys(cruises).map((x) => {
            return {
              key: x,
              value: x,
              text: <OSUID uuIDs={{ cruise: x }} />,
            };
          })}
        />
        <ItemsCruiseProgramModal>
          <Button primary fluid icon style={{ marginBottom: 2 }}>
            <Icon name="plus" />
          </Button>
        </ItemsCruiseProgramModal>
      </FormGridColumns>
      <Form.Field
        label="Dive Type"
        control={() => (
          <ButtonGroup fluid>
            <Button primary={dive?.rov === undefined}>Dredge</Button>
            <Button primary={dive?.rov !== undefined}>ROV</Button>
          </ButtonGroup>
        )}
      />
      <Form.Input
        fluid
        label="Dive ID"
        placeholder="Required"
        error={!dive?.id}
        value={dive?.id || ''}
      />
      <Form.Input
        fluid
        label="OSU ID"
        placeholder="Calculated"
        value={calculatedOSUID({ cruise, dive })}
      />
      <Form.Input fluid label="Dive Notes" value={dive?.notes || ''} />
      <Form.Select
        fluid
        search
        selection
        allowAdditions
        label="Material"
        options={[]}
        placeholder="Required"
        error={!dive?.material}
        value={dive?.material || ''}
      />
      <Form.Select
        fluid
        search
        selection
        allowAdditions
        label="Recovery Method"
        options={[]}
        placeholder="Required"
        error={!dive?.method}
        value={dive?.method || ''}
      />
      <FormGridColumns widths={[8, 8]}>
        <Form.Input fluid label="Area" value={dive?.area || ''} />
        <Form.Input fluid label="Place" value={dive?.place || ''} />
      </FormGridColumns>
      <Form.Select
        fluid
        search
        selection
        allowAdditions
        label="Contact PI Name"
        placeholder="Required"
        error={!dive?.pi}
        value={dive?.pi || ''}
        options={_.keys(
          _.keys(dives).reduce((pis, x) => {
            const { pi } = dives[x];
            if (pi !== undefined) {
              pis[pi] = true;
            }
            return pis;
          }, {})
        ).map((x) => {
          return {
            key: x,
            value: x,
          };
        })}
      />
      <Form.Select
        fluid
        search
        selection
        allowAdditions
        label="Contact PI Institution"
        placeholder="Required"
        error={!dive?.piInstitution}
        value={dive?.piInstitution || ''}
        options={_.keys(
          _.keys(dives).reduce((piInstitutions, x) => {
            const { piInstitution } = dives[x];
            if (piInstitution !== undefined) {
              piInstitutions[piInstitution] = true;
            }
            return piInstitutions;
          }, {})
        ).map((x) => {
          return {
            key: x,
            value: x,
          };
        })}
      />
      <Form.Input fluid label="Contact PI Email" placeholder="Required" error />
      <Form.Field style={{ marginBottom: 0 }}>
        <label>Samples</label>
      </Form.Field>
      {/* dive?.samples.map(x =>
					<FormGridColumns key={ x } widths={ [2, 12, 2] }>
						<ItemsDiveSampleModal>
							<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='edit'/></Button>
						</ItemsDiveSampleModal>
						<OSUID as='input' uuIDs={{ diveSample: x }}/>
						<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='delete'/></Button>
					</FormGridColumns>
				) */}
      <FormGridColumns widths={[14, 2]}>
        <Form.Select
          fluid
          multiple
          search
          renderLabel={({ value }) => `${value}`}
          options={_.keys(diveSamples).map((x) => {
            return {
              key: x,
              value: x,
              text: <OSUID uuIDs={{ diveSample: x }} />,
            };
          })}
        />
        <Button primary fluid icon style={{ marginBottom: 2 }}>
          <Icon name="plus" />
        </Button>
      </FormGridColumns>
    </Form>
  );
};

const ItemsDiveModal: FunctionComponent<{
  uuID?: string;
}> = ({ children, uuID }) => {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      trigger={children}
      icon={diveIcon}
      title="Dive"
      onOpen={() => _.defer(() => setOpen(true))}
      buttons={() => (
        <>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
        </>
      )}
    >
      {open && <ItemsDiveModalContent uuID={uuID} />}
      {!open && (
        <Dimmer inverted active>
          <Loader>Loading</Loader>
        </Dimmer>
      )}
    </Modal>
  );
};

export default ItemsDiveModal;
