import _ from 'lodash';
import numeral from 'numeral';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Icon, Form, ButtonGroup } from 'semantic-ui-react';
import FormGridColumns from './form.grid.columns';
import Modal from './modal';
// eslint-disable-next-line import/no-cycle
import ItemsSectionModal from './items.section.modal';
// eslint-disable-next-line import/no-cycle
import ItemsSectionSampleModal from './items.section-sample.modal';
import { itemByUUID, countByUUIDs } from '../es';
import OSUID from './osu.id';
import { loginState, SectionHalf, sectionHalfIcon } from '../stores/items';
import ItemsChildrenBlock from './items.item-children-block';
import ItemsFormSelect from './items.form.select';
import GridButtonIcon from './grid.button.icon';
import ItemsFormInput from './items.form.input';
import ItemsPrintLabelsModal from './items.print-labels.modal';

const ItemsSectionHalfModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const login = useRecoilValue(loginState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sectionHalf, setSectionHalf] = useState<SectionHalf | undefined>(
    undefined
  );
  const [sectionSamplesCount, setSectionSamplesCount] = useState<
    number | undefined
  >(undefined);
  useEffect(() => {
    setSectionHalf(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        setSectionHalf((await itemByUUID(uuid)) as SectionHalf);
      })();
  }, [uuid, isOpen]);
  useEffect(() => {
    if (
      isOpen &&
      uuid !== undefined &&
      sectionHalf !== undefined &&
      sectionHalf._sectionUUID !== undefined
    )
      (async () => {
        setSectionSamplesCount(
          await countByUUIDs(
            [sectionHalf._sectionHalfUUID || ''],
            'sectionSample'
          )
        );
      })();
  }, [uuid, isOpen, sectionHalf]);
  return (
    <Modal
      trigger={children}
      icon={sectionHalfIcon}
      title="Section-Half"
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
            label="Section"
            placeholder="Required"
            error={!sectionHalf?._sectionUUID}
            value={sectionHalf?._sectionUUID || ''}
            type="section"
            options={[]}
          />
          <ItemsSectionModal>
            <GridButtonIcon disabled icon="plus" />
          </ItemsSectionModal>
        </FormGridColumns>
        <Form.Field
          label="Half-Core Type"
          control={() => (
            <ButtonGroup fluid>
              <Button primary={sectionHalf?.type === 'Round'}>
                Whole Round
              </Button>
              <Button primary={sectionHalf?.type === 'Working'}>Working</Button>
              <Button primary={sectionHalf?.type === 'Archive'}>Archive</Button>
            </ButtonGroup>
          )}
        />
        <Form.Input
          label="OSU ID (Calculated)"
          placeholder="Calculated"
          value={sectionHalf?._osuid}
        />
        <ItemsFormInput label="IGSN" value={sectionHalf?.igsn} />
        <ItemsFormInput label="Notes" value={sectionHalf?.notes || ''} />
        <Form.Field style={{ marginBottom: 0 }}>
          <label>
            {(sectionSamplesCount &&
              `${numeral(sectionSamplesCount).format('0,0')} `) ||
              ''}
            Section Samples
          </label>
        </Form.Field>
        {[
          ...Array(
            Math.max(1, Math.ceil((sectionSamplesCount || 1) / 10))
          ).keys(),
        ].map((i) => (
          <ItemsChildrenBlock
            key={i}
            uuid={sectionHalf?._coreUUID || ''}
            type="sectionSample"
            from={i * 10}
            size={10}
            minRowHeight={30}
            itemRow={(item) => (
              <FormGridColumns key={item._uuid} widths={[2, 12, 2]}>
                <ItemsSectionSampleModal>
                  <Button primary fluid icon style={{ marginBottom: 2 }}>
                    <Icon name="edit" />
                  </Button>
                </ItemsSectionSampleModal>
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
          <Button
            primary
            fluid
            icon
            style={{ marginBottom: 2, paddingLeft: 0, paddingRight: 0 }}
            disabled
          >
            <Icon name="plus" />
          </Button>
        </FormGridColumns>
      </>
    </Modal>
  );
};

export default ItemsSectionHalfModal;
