import _ from 'lodash';
import numeral from 'numeral';
import { FunctionComponent, useState, useEffect } from 'react';
import { Button, Icon, Form } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import Modal from './modal';
import FormGridColumns from './form.grid.columns';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import ItemsDiveSampleModal from './items.dive-sample.modal';
import { itemByUUID, countByUUIDs } from '../common/es';
import { coreTypes } from '../common/vocabularies';
import OSUID from './osu.id';
import { Dive, itemTypesIcon } from '../stores/items';
import ItemsChildrenBlock from './items.item-children-block';
import ItemsFormSelect from './items.form.select';
import GridButtonIcon from './grid.button.icon';
import ItemsFormInput from './items.form.input';

const ItemsDiveModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const isMounted = useMountedState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dive, setDive] = useState<Dive | undefined>(undefined);
  const [diveSamplesCount, setDiveSamplesCount] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    setDive(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        const update = await itemByUUID(uuid);
        if (isMounted()) setDive(update as Dive);
      })();
  }, [isMounted, uuid, isOpen]);
  useEffect(() => {
    if (
      isOpen &&
      uuid !== undefined &&
      dive !== undefined &&
      dive._diveUUID !== undefined
    )
      (async () => {
        const update = await countByUUIDs([dive._diveUUID || ''], 'diveSample');
        if (isMounted()) setDiveSamplesCount(update);
      })();
  }, [isMounted, uuid, isOpen, dive]);
  return (
    <Modal
      trigger={children}
      icon={itemTypesIcon.dive}
      title="Dive"
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
            label="Cruise/Program"
            placeholder="Required"
            error={!dive?._cruiseUUID}
            value={dive?._cruiseUUID || ''}
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
            label="Dive ID"
            placeholder="Required"
            error={dive?.id === ''}
            value={dive?.id || ''}
          />
          <ItemsFormSelect
            label="Collection Method"
            placeholder="Required"
            error={!dive?.method}
            value={dive?.method || ''}
            options={_.keys(coreTypes)
              .sort()
              .map((x) => ({
                key: coreTypes[x],
                value: x,
                text: x,
              }))}
          />
          <ItemsCruiseProgramModal>
            <GridButtonIcon icon="plus" />
          </ItemsCruiseProgramModal>
        </FormGridColumns>
        <Form.Input
          fluid
          readOnly
          label="OSU ID (Calculated)"
          value={dive?._osuid}
        />
        <ItemsFormInput label="IGSN" value={dive?.igsn} />
        <ItemsFormInput label="ROV Name" value={dive?.rov} />
        <FormGridColumns widths={[8, 8]}>
          <ItemsFormInput fluid label="Area" value={dive?.area || ''} />
          <ItemsFormInput fluid label="Place" value={dive?.place || ''} />
        </FormGridColumns>
        <ItemsFormInput fluid label="Dive Notes" value={dive?.notes || ''} />
        <Form.Field style={{ marginBottom: 0 }}>
          <label>
            {(diveSamplesCount &&
              `${numeral(diveSamplesCount).format('0,0')} `) ||
              ''}
            Dive Sample{diveSamplesCount === 1 ? '' : 's'}
          </label>
        </Form.Field>
        {[
          ...Array(Math.max(1, Math.ceil((diveSamplesCount || 1) / 10))).keys(),
        ].map((i) => (
          <ItemsChildrenBlock
            key={i}
            uuid={dive?._coreUUID || ''}
            type="diveSample"
            from={i * 10}
            size={10}
            minRowHeight={30}
            itemRow={(item) => (
              <FormGridColumns key={item._uuid} widths={[2, 12, 2]}>
                <ItemsDiveSampleModal uuid={item._uuid}>
                  <Button primary fluid icon style={{ marginBottom: 2 }}>
                    <Icon name="edit" />
                  </Button>
                </ItemsDiveSampleModal>
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
                text: <OSUID uuIDs={{ diveSample: x }} />,
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

export default ItemsDiveModal;
