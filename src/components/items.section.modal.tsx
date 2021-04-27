import _ from 'lodash';
import React, { FunctionComponent, useState } from 'react';
import { Button, Icon, Form, Dimmer, Loader } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import FormGridColumns from './form.grid.columns';
import Modal from './modal';
import ItemsCoreModal from './items.core.modal';
// import ItemsSectionHalfModal from './items.section-half.modal';
import OSUID, { calculatedOSUID } from './osu.id';
import {
  cruisesState,
  Cruise,
  coresState,
  Core,
  sectionsState,
  sectionIcon,
  Section,
  sectionHalvesState,
} from '../stores/items';

const ItemsSectionModalContent: FunctionComponent<{
  uuID?: string;
}> = ({ uuID }) => {
  const cruises = useRecoilValue(cruisesState);
  const cores = useRecoilValue(coresState);
  const sections = useRecoilValue(sectionsState);
  const sectionHalves = useRecoilValue(sectionHalvesState);
  const section: Section | undefined = (uuID && sections[uuID]) || undefined;
  const coreUUID: string | undefined =
    uuID && sections[uuID] && sections[uuID].core;
  const core: Core | undefined = (coreUUID && cores[coreUUID]) || undefined;
  const cruiseUUID: string | undefined =
    coreUUID && cores[coreUUID] && cores[coreUUID].cruise;
  const cruise: Cruise | undefined =
    (cruiseUUID && cruises[cruiseUUID]) || undefined;
  return (
    <Form>
      <FormGridColumns widths={[14, 2]}>
        <Form.Select
          fluid
          search
          selection
          label="Core"
          placeholder="Required"
          error={!section?.core}
          value={section?.core || ''}
          options={_.keys(cores).map((x) => {
            return {
              key: x,
              value: x,
              text: <OSUID uuIDs={{ core: x }} />,
            };
          })}
        />
        <ItemsCoreModal>
          <Button primary fluid icon style={{ marginBottom: 2 }}>
            <Icon name="plus" />
          </Button>
        </ItemsCoreModal>
      </FormGridColumns>
      <Form.Input
        fluid
        label="Section ID"
        placeholder="Required"
        error={!section?.id}
        value={section?.id || ''}
      />
      <Form.Input
        fluid
        label="OSU ID"
        placeholder="Calculated"
        value={calculatedOSUID({ cruise, core, section })}
      />
      <Form.Input
        fluid
        label="Section Alternate Name"
        value={section?.alternateName || ''}
      />
      <FormGridColumns widths={[6, 6, 4]}>
        <Form.Input
          fluid
          label="Depth Top (cm)"
          placeholder="Required"
          error={!section?.depthTop}
          value={section?.depthTop || ''}
        />
        <Form.Input
          fluid
          label="Depth Bottom (cm)"
          placeholder="Required"
          error={!section?.depthBottom}
          value={section?.depthBottom || ''}
        />
        <Form.Input
          fluid
          label="Length (cm)"
          placeholder="Calculated"
          value={
            (section?.depthTop &&
              section?.depthBottom &&
              Number.parseFloat(section?.depthBottom) -
                Number.parseFloat(section?.depthTop)) ||
            ''
          }
        />
      </FormGridColumns>
      <Form.Field style={{ marginBottom: 0 }}>
        <label>Section Halves</label>
      </Form.Field>
      {/* section?.sectionHalves.map(x =>
					<FormGridColumns key={ x } widths={ [2, 12, 2] }>
						<ItemsSectionHalfModal>
							<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='edit'/></Button>
						</ItemsSectionHalfModal>
						<OSUID as='input' uuIDs={{ sectionHalf: x }}/>
						<Button primary fluid icon style={{ marginBottom: 2 }}><Icon name='delete'/></Button>
					</FormGridColumns>
				) */}
      <FormGridColumns widths={[14, 2]}>
        <Form.Select
          fluid
          multiple
          search
          renderLabel={({ value }) => `${value}`}
          options={_.keys(sectionHalves).map((x) => {
            return {
              key: x,
              value: x,
              text: <OSUID uuIDs={{ sectionHalf: x }} />,
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

const ItemsSectionModal: FunctionComponent<{
  uuID?: string;
}> = ({ children, uuID }) => {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      trigger={children}
      icon={sectionIcon}
      title="Section"
      onOpen={() => _.defer(() => setOpen(true))}
      buttons={() => (
        <>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
        </>
      )}
    >
      {open && <ItemsSectionModalContent uuID={uuID} />}
      {!open && (
        <Dimmer inverted active>
          <Loader>Loading</Loader>
        </Dimmer>
      )}
    </Modal>
  );
};

export default ItemsSectionModal;
