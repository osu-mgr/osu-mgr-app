import _ from 'lodash';
import numeral from 'numeral';
import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Icon, Form } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import FormGridColumns from './form.grid.columns';
import Modal from './modal';
import ItemsCoreModal from './items.core.modal';
import ItemsSectionHalfModal from './items.section-half.modal';
import { itemByUUID, countByUUIDs } from '../common/es';
import OSUID from './osu.id';
import { loginState } from '../stores/accounts';
import { Section, itemTypesIcon } from '../stores/items';
import ItemsChildrenBlock from './items.item-children-block';
import ItemsFormSelect from './items.form.select';
import GridButtonIcon from './grid.button.icon';
import ItemsFormInput from './items.form.input';
import ItemsPrintLabelsModal from './items.print-labels.modal';

const ItemsSectionModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const isMounted = useMountedState();
  const login = useRecoilValue(loginState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [section, setSection] = useState<Section | undefined>(undefined);
  const [sectionHalvesCount, setSectionHalvesCount] = useState<
    number | undefined
  >(undefined);
  useEffect(() => {
    setSection(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        const update = await itemByUUID(uuid);
        if (isMounted()) setSection(update as Section);
      })();
  }, [isMounted, uuid, isOpen]);
  useEffect(() => {
    if (
      isOpen &&
      uuid !== undefined &&
      section !== undefined &&
      section._coreUUID !== undefined
    )
      (async () => {
        const update = await countByUUIDs(
          [section._sectionUUID || ''],
          'sectionHalf'
        );
        if (isMounted()) setSectionHalvesCount(update);
      })();
  }, [isMounted, uuid, isOpen, section]);
  return (
    <Modal
      trigger={children}
      icon={itemTypesIcon.section}
      title="Section"
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
            label="Core"
            placeholder="Required"
            error={!section?._coreUUID}
            value={section?._coreUUID || ''}
            type="core"
            options={[]}
          />
          <ItemsCoreModal>
            <GridButtonIcon icon="plus" />
          </ItemsCoreModal>
        </FormGridColumns>
        <ItemsFormInput
          label="Section ID"
          placeholder="Required"
          error={!section?.id}
          value={section?.id || ''}
        />
        <Form.Input
          label="OSU ID (Calculated)"
          placeholder="Calculated"
          value={section?._osuid}
        />
        <ItemsFormInput label="IGSN" value={section?.igsn} />
        <ItemsFormInput
          label="Section Alternate Name"
          value={section?.alternateName || ''}
        />
        <FormGridColumns widths={[6, 6, 4]}>
          <ItemsFormInput
            label="Depth Top (cm)"
            placeholder="Required"
            error={!section?.depthTop}
            value={section?.depthTop || ''}
          />
          <ItemsFormInput
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
              (section?.depthTop !== undefined &&
                section?.depthBottom !== undefined &&
                Number.parseFloat(section?.depthBottom) -
                  Number.parseFloat(section?.depthTop)) ||
              ''
            }
          />
        </FormGridColumns>
        <Form.Field style={{ marginBottom: 0 }}>
          <label>
            {(sectionHalvesCount &&
              `${numeral(sectionHalvesCount).format('0,0')} `) ||
              ''}
            Section {sectionHalvesCount === 1 ? 'Half' : 'Halves'}
          </label>
        </Form.Field>
        {[
          ...Array(
            Math.max(1, Math.ceil((sectionHalvesCount || 1) / 10))
          ).keys(),
        ].map((i) => (
          <ItemsChildrenBlock
            key={i}
            uuid={section?._sectionUUID || ''}
            type="sectionHalf"
            from={i * 10}
            size={10}
            minRowHeight={30}
            itemRow={(item) => (
              <FormGridColumns key={item._uuid} widths={[2, 12, 2]}>
                <ItemsSectionHalfModal>
                  <Button primary fluid icon style={{ marginBottom: 2 }}>
                    <Icon name="edit" />
                  </Button>
                </ItemsSectionHalfModal>
                <Form.Input fluid readOnly value={item._osuid} />
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
                text: <OSUID uuIDs={{ sectionHalf: x }} />,
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

export default ItemsSectionModal;
