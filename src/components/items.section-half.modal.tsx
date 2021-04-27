import React, { FunctionComponent } from 'react';
import { Button, Icon, Form, ButtonGroup } from 'semantic-ui-react';
import Modal from './modal';
import FormGridColumns from './form.grid.columns';
import ItemsCoreModal from './items.core.modal';
import ItemsSectionModal from './items.section.modal';
import { sectionHalfIcon } from '../stores/items';

const ItemsSectionHalfModal: FunctionComponent = ({ children }) => {
  return (
    <Modal
      trigger={children}
      icon={sectionHalfIcon}
      title="Half-Core"
      buttons={() => (
        <>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
        </>
      )}
    >
      <Form>
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            search
            selection
            label="Core"
            placeholder="Required"
            error
            options={[]}
          />
          <ItemsCoreModal>
            <Button primary fluid icon style={{ marginBottom: 2 }}>
              <Icon name="plus" />
            </Button>
          </ItemsCoreModal>
        </FormGridColumns>
        <Form.Field
          label="Half-Core Type"
          control={() => (
            <ButtonGroup fluid>
              <Button primary>Whole Round</Button>
              <Button>Working</Button>
              <Button>Archive</Button>
            </ButtonGroup>
          )}
        />
        <Form.Input fluid label="OSU ID" placeholder="Calculated" />
        <Form.Input fluid label="Half-Core Notes" />
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            multiple
            search
            selection
            label="Sections"
            options={[]}
          />
          <ItemsSectionModal>
            <Button primary fluid icon style={{ marginBottom: 2 }}>
              <Icon name="plus" />
            </Button>
          </ItemsSectionModal>
        </FormGridColumns>
      </Form>
    </Modal>
  );
};

export default ItemsSectionHalfModal;
