import _ from 'lodash';
import { FunctionComponent, useState, useEffect } from 'react';
import { Button, Icon, Form } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import Modal from './modal';
import FormGridColumns from './form.grid.columns';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import { itemByUUID } from '../common/es';
import { DiveSubsample, itemTypesIcon } from '../stores/items';
import ItemsFormSelect from './items.form.select';
import GridButtonIcon from './grid.button.icon';
import ItemsFormInput from './items.form.input';

const ItemsDiveSampleModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const isMounted = useMountedState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [diveSubsample, setDiveSubsample] = useState<DiveSubsample | undefined>(
    undefined
  );
  useEffect(() => {
    setDiveSubsample(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        const update = await itemByUUID(uuid);
        if (isMounted()) setDiveSubsample(update as DiveSubsample);
      })();
  }, [isMounted, uuid, isOpen]);
  return (
    <Modal
      trigger={children}
      icon={itemTypesIcon.diveSample}
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
            error={!diveSubsample?._diveUUID}
            value={diveSubsample?._diveUUID || ''}
            type="dive"
            options={[]}
          />
          <ItemsCruiseProgramModal>
            <GridButtonIcon icon="plus" />
          </ItemsCruiseProgramModal>
        </FormGridColumns>
        <ItemsFormInput
          fluid
          label="Dive Subsample ID"
          placeholder="Required"
          error={diveSubsample?.id === ''}
          value={diveSubsample?.id || ''}
        />
        <Form.Input
          fluid
          readOnly
          label="OSU ID (Calculated)"
          value={diveSubsample?._osuid}
        />
        <ItemsFormInput label="IGSN" value={diveSubsample?.igsn} />
      </>
    </Modal>
  );
};

export default ItemsDiveSampleModal;
