import { FunctionComponent, useState, useEffect } from 'react';
import { Button, Icon, Form } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import FormGridColumns from './form.grid.columns';
import Modal from './modal';
import ItemSectionHalfModal from './items.section-half.modal';
import { itemByUUID } from '../common/es';
import { SectionSample, itemTypesIcon } from '../stores/items';
import ItemsFormSelect from './items.form.select';
import GridButtonIcon from './grid.button.icon';
import ItemsFormInput from './items.form.input';

const ItemsSectionSampleModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const isMounted = useMountedState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sectionSample, setSectionSample] = useState<SectionSample | undefined>(
    undefined
  );
  useEffect(() => {
    setSectionSample(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        const update = await itemByUUID(uuid);
        if (isMounted()) setSectionSample(update as SectionSample);
      })();
  }, [isMounted, uuid, isOpen]);
  return (
    <Modal
      trigger={children}
      icon={itemTypesIcon.sectionSample}
      title="Section Sample"
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
            label="Section Half"
            placeholder="Required"
            error={!sectionSample?._sectionHalfUUID}
            value={sectionSample?._sectionHalfUUID || ''}
            type="sectionHalf"
            options={[]}
          />
          <ItemSectionHalfModal>
            <GridButtonIcon icon="plus" />
          </ItemSectionHalfModal>
        </FormGridColumns>
        <ItemsFormInput
          label="Section Sample ID"
          placeholder="Required"
          error={!sectionSample?.id}
          value={sectionSample?.id || ''}
        />
        <Form.Input
          label="OSU ID (Calculated)"
          placeholder="Calculated"
          value={sectionSample?._osuid}
        />
        <ItemsFormInput label="IGSN" value={sectionSample?.igsn} />\{' '}
      </>
    </Modal>
  );
};

export default ItemsSectionSampleModal;
