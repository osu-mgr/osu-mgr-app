import _ from 'lodash';
import numeral from 'numeral';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Icon, Form } from 'semantic-ui-react';
import Modal from './modal';
import FormGridColumns from './form.grid.columns';
// eslint-disable-next-line import/no-cycle
import ItemsCruiseProgramModal from './items.cruise-program.modal';
// eslint-disable-next-line import/no-cycle
import ItemsSectionModal from './items.section.modal';
import { itemByUUID, countByUUIDs } from '../es';
import OSUID from './osu.id';
import { loginState, Core, coreIcon, coreTypes } from '../stores/items';
import ItemsChildrenBlock from './items.item-children-block';
import ItemsFormSelect from './items.form.select';
import GridButtonIcon from './grid.button.icon';
import ItemsFormInput from './items.form.input';
import ItemsPrintLabelsModal from './items.print-labels.modal';

const ItemsCoreModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const login = useRecoilValue(loginState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [core, setCore] = useState<Core | undefined>(undefined);
  const [sectionsCount, setSectionsCount] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    setCore(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        setCore((await itemByUUID(uuid)) as Core);
      })();
  }, [uuid, isOpen]);
  useEffect(() => {
    if (
      isOpen &&
      uuid !== undefined &&
      core !== undefined &&
      core._coreUUID !== undefined
    )
      (async () => {
        setSectionsCount(await countByUUIDs([core._coreUUID || ''], 'section'));
      })();
  }, [uuid, isOpen, core]);
  return (
    <Modal
      trigger={children}
      icon={coreIcon}
      title="Core"
      buttons={() => (
        <>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
          <ItemsPrintLabelsModal uuids={[uuid || '']}>
            <Button
              primary
              disabled={
                uuid === undefined ||
                !login ||
                !login._permissions?.includes('print_labels')
              }
              icon
              style={{ float: 'left' }}
            >
              <Icon name="print" /> Print
            </Button>
          </ItemsPrintLabelsModal>
        </>
      )}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <>
        <FormGridColumns widths={[14, 2]}>
          <ItemsFormSelect
            search
            selection
            label="Cruise/Program"
            placeholder="Required"
            error={!core?._cruiseUUID}
            value={core?._cruiseUUID || ''}
            type="cruise"
            options={[]}
          />
          <ItemsCruiseProgramModal>
            <GridButtonIcon icon="plus" />
          </ItemsCruiseProgramModal>
        </FormGridColumns>
        <FormGridColumns widths={[4, 12]}>
          <ItemsFormInput
            fluid
            label="Core ID"
            placeholder="Required"
            error={core?.id === ''}
            value={core?.id || ''}
          />
          <ItemsFormSelect
            label="Collection Method"
            placeholder="Required"
            error={!core?.method}
            value={core?.method || ''}
            options={_.keys(coreTypes)
              .sort()
              .map((x) => ({
                key: coreTypes[x],
                value: x,
                text: x,
              }))}
          />
        </FormGridColumns>
        <Form.Input
          fluid
          readOnly
          label="OSU ID (Calculated)"
          value={core?._osuid || ''}
        />
        <ItemsFormInput label="IGSN" value={core?.igsn} />
        <FormGridColumns widths={[6, 4, 6]}>
          <ItemsFormInput
            fluid
            label="Core Length (m)"
            placeholder="Required"
            error={
              core?.length === undefined ||
              Number.isNaN(Number.parseFloat(core.length))
            }
            value={core?.length || ''}
          />
          <ItemsFormInput
            fluid
            label="N Sections"
            placeholder="Required"
            error={
              core?.nSections === undefined ||
              Number.isNaN(Number.parseInt(core.nSections, 10))
            }
            value={core?.nSections || ''}
          />
          <ItemsFormInput
            fluid
            label="Core Diameter (cm)"
            value={core?.diameter || ''}
          />
        </FormGridColumns>
        <ItemsFormInput fluid label="Material" value={core?.material || ''} />
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Date"
            value={core?.startDate || ''}
          />
          <ItemsFormInput fluid label="End Date" value={core?.endDate || ''} />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Time"
            value={core?.startTime || ''}
          />
          <ItemsFormInput fluid label="End Time" value={core?.endTime || ''} />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Latitude"
            placeholder="Required"
            error={
              core?.latitudeStart === undefined ||
              Number.isNaN(Number.parseFloat(core.latitudeStart))
            }
            value={core?.latitudeStart || ''}
          />
          <ItemsFormInput
            fluid
            label="End Latitude"
            value={core?.latitudeEnd || ''}
          />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Longitude"
            placeholder="Required"
            error={
              core?.longitudeStart === undefined ||
              Number.isNaN(Number.parseFloat(core.longitudeStart))
            }
            value={core?.longitudeStart || ''}
          />
          <ItemsFormInput
            fluid
            label="End Longitude"
            value={core?.longitudeEnd || ''}
          />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Water Depth (m)"
            placeholder="Required"
            error={
              core?.waterDepthStart === undefined ||
              Number.isNaN(Number.parseFloat(core.waterDepthStart))
            }
            value={core?.waterDepthStart || ''}
          />
          <ItemsFormInput
            fluid
            label="End Water Depth (m)"
            value={core?.waterDepthEnd || ''}
          />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput fluid label="Area" value={core?.area || ''} />
          <ItemsFormInput fluid label="Place" value={core?.place || ''} />
        </FormGridColumns>
        <ItemsFormInput fluid label="Core Notes" value={core?.notes || ''} />
        <Form.Field style={{ marginBottom: 0 }}>
          <label>
            {(sectionsCount && `${numeral(sectionsCount).format('0,0')} `) ||
              ''}
            Section{sectionsCount === 1 ? '' : 's'}
          </label>
        </Form.Field>
        {[
          ...Array(Math.max(1, Math.ceil((sectionsCount || 1) / 10))).keys(),
        ].map((i) => (
          <ItemsChildrenBlock
            key={i}
            uuid={core?._coreUUID || ''}
            type="section"
            from={i * 10}
            size={10}
            minRowHeight={30}
            itemRow={(item) => (
              <FormGridColumns key={item._uuid} widths={[2, 12, 2]}>
                <ItemsSectionModal uuid={item._uuid}>
                  <Button primary fluid icon style={{ marginBottom: 2 }}>
                    <Icon name="edit" />
                  </Button>
                </ItemsSectionModal>
                <Form.Input fluid readOnly value={item._osuid || ''} />
                <Button primary fluid icon style={{ marginBottom: 2 }}>
                  <Icon name="delete" />
                </Button>
              </FormGridColumns>
            )}
          />
        ))}
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            multiple
            search
            renderLabel={({ value }) => `${value}`}
            options={_.keys({}).map((x) => {
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
      </>
    </Modal>
  );
};

export default ItemsCoreModal;
