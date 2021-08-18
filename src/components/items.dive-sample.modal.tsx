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
import {
  loginState,
  DiveSample,
  diveSampleIcon,
  diveTypes,
} from '../stores/items';
import ItemsChildrenBlock from './items.item-children-block';
import ItemsFormSelect from './items.form.select';
import GridButtonIcon from './grid.button.icon';
import ItemsFormInput from './items.form.input';
import ItemsPrintLabelsModal from './items.print-labels.modal';

const ItemsDiveSampleModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const login = useRecoilValue(loginState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [diveSample, setDiveSample] = useState<DiveSample | undefined>(
    undefined
  );
  const [diveSubsampleCount, setDiveSubsampleCount] = useState<
    number | undefined
  >(undefined);
  useEffect(() => {
    setDiveSample(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        setDiveSample((await itemByUUID(uuid)) as DiveSample);
      })();
  }, [uuid, isOpen]);
  useEffect(() => {
    if (
      isOpen &&
      uuid !== undefined &&
      diveSample !== undefined &&
      diveSample._diveSampleUUID !== undefined
    )
      (async () => {
        setDiveSubsampleCount(
          await countByUUIDs(
            [diveSample._diveSampleUUID || ''],
            'diveSubsample'
          )
        );
      })();
  }, [uuid, isOpen, diveSample]);
  return (
    <Modal
      trigger={children}
      icon={diveSampleIcon}
      title="Dive Sample"
      buttons={() => (
        <>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
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
            label="Dive"
            placeholder="Required"
            error={!diveSample?._diveUUID}
            value={diveSample?._diveUUID || ''}
            type="dive"
            options={[]}
          />
          <ItemsCruiseProgramModal>
            <GridButtonIcon icon="plus" />
          </ItemsCruiseProgramModal>
        </FormGridColumns>
        <ItemsFormInput
          fluid
          label="Dive Sample ID"
          placeholder="Required"
          error={diveSample?.id === ''}
          value={diveSample?.id || ''}
        />
        <Form.Input
          fluid
          readOnly
          label="OSU ID (Calculated)"
          value={diveSample?._osuid}
        />
        <ItemsFormInput label="IGSN" value={diveSample?.igsn} />
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Date"
            value={diveSample?.startDate || ''}
          />
          <ItemsFormInput
            fluid
            label="End Date"
            value={diveSample?.endDate || ''}
          />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Time"
            value={diveSample?.startTime || ''}
          />
          <ItemsFormInput
            fluid
            label="End Time"
            value={diveSample?.endTime || ''}
          />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Latitude"
            value={diveSample?.latitudeStart || ''}
          />
          <ItemsFormInput
            fluid
            label="End Latitude"
            value={diveSample?.latitudeEnd || ''}
          />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Longitude"
            value={diveSample?.longitudeStart || ''}
          />
          <ItemsFormInput
            fluid
            label="End Longitude"
            value={diveSample?.longitudeEnd || ''}
          />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput
            fluid
            label="Start Water Depth (mbsf)"
            value={diveSample?.waterDepthStart || ''}
          />
          <ItemsFormInput
            fluid
            label="End Water Depth (mbsf)"
            value={diveSample?.waterDepthEnd || ''}
          />
        </FormGridColumns>
        <Form.Field style={{ marginBottom: 0 }}>
          <label>
            {(diveSubsampleCount &&
              `${numeral(diveSubsampleCount).format('0,0')} `) ||
              ''}
            Dive Subsample{diveSubsampleCount === 1 ? '' : 's'}
          </label>
        </Form.Field>
        {[
          ...Array(
            Math.max(1, Math.ceil((diveSubsampleCount || 1) / 10))
          ).keys(),
        ].map((i) => (
          <ItemsChildrenBlock
            key={i}
            uuid={diveSample?._diveSampleUUID || ''}
            type="diveSample"
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

export default ItemsDiveSampleModal;
