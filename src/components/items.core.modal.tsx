import _ from 'lodash';
import React, { FunctionComponent, useState } from 'react';
import { Button, Icon, Form, Dimmer, Loader } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import FormGridColumns from './form.grid.columns';
import Modal from './modal';
import ItemsDeploymentDiveModal from './items.dive.modal';
// import ItemsSectionModal from './items.section.modal';
import OSUID, { calculatedOSUID } from './osu.id';
import {
  cruisesState,
  Cruise,
  coresState,
  coreIcon,
  Core,
  sectionsState,
} from '../stores/items';

const ItemsCoreModalContent: FunctionComponent<{
  uuID?: string;
}> = ({ uuID }) => {
  const cruises = useRecoilValue(cruisesState);
  const cores = useRecoilValue(coresState);
  const sections = useRecoilValue(sectionsState);
  const core: Core | undefined = (uuID && cores[uuID]) || undefined;
  const cruiseUUID: string | undefined =
    uuID && cores[uuID] && cores[uuID].cruise;
  const cruise: Cruise | undefined =
    (cruiseUUID && cruises[cruiseUUID]) || undefined;
  console.log('core', core);
  return (
    <Form>
      <FormGridColumns widths={[14, 2]}>
        <Form.Select
          fluid
          search
          selection
          label="Cruise/Program"
          placeholder="Required"
          error={!core?.cruise}
          value={core?.cruise || ''}
          options={_.keys(cruises).map((x) => {
            return {
              key: x,
              value: x,
              text: <OSUID uuIDs={{ cruise: x }} />,
            };
          })}
        />
        <ItemsDeploymentDiveModal>
          <Button primary fluid icon style={{ marginBottom: 2 }}>
            <Icon name="plus" />
          </Button>
        </ItemsDeploymentDiveModal>
      </FormGridColumns>
      <Form.Input
        fluid
        label="Core ID"
        placeholder="Required"
        error={!core?.id}
        value={core?.id || ''}
      />
      <Form.Input
        fluid
        label="OSU ID"
        placeholder="Calculated"
        value={calculatedOSUID({ cruise, core })}
      />
      <Form.Input fluid label="Core Notes" value={core?.notes || ''} />
      <Form.Input
        fluid
        label="Core Diameter (cm)"
        placeholder="Required"
        error={!core?.diameter}
        value={core?.diameter || ''}
      />
      <Form.Input
        fluid
        label="Core Length (m)"
        placeholder="Required"
        error={!core?.length}
        value={core?.length || ''}
      />
      <Form.Field style={{ marginBottom: 0 }}>
        <label>Sections</label>
      </Form.Field>
      {/* core.sections.map(x =>
					<FormGridColumns key={ x } widths={ [2, 12, 2] }>
						<ItemsSectionModal>
							<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='edit'/></Button>
						</ItemsSectionModal>
						<OSUID as='input' uuIDs={{ section: x }}/>
						<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='delete'/></Button>
					</FormGridColumns>
				) */}
      <FormGridColumns widths={[14, 2]}>
        <Form.Select
          fluid
          multiple
          search
          renderLabel={({ value }) => `${value}`}
          options={_.keys(sections).map((x) => {
            return {
              key: x,
              value: x,
              text: <OSUID uuIDs={{ section: x }} />,
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

const ItemsCoreModal: FunctionComponent<{
  uuID?: string;
}> = ({ children, uuID }) => {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      trigger={children}
      icon={coreIcon}
      title="Core"
      onOpen={() => _.defer(() => setOpen(true))}
      buttons={() => (
        <>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
        </>
      )}
    >
      {open && <ItemsCoreModalContent uuID={uuID} />}
      {!open && (
        <Dimmer inverted active>
          <Loader>Loading</Loader>
        </Dimmer>
      )}
    </Modal>
  );
};

export default ItemsCoreModal;
