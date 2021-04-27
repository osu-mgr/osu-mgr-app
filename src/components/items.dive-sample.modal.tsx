import React, { FunctionComponent } from 'react';
import { Button, ButtonGroup, Icon, Form } from 'semantic-ui-react';
import FormGridColumns from './form.grid.columns';
import Modal from './modal';
import ItemsCruiseProgramModal from './items.cruise-program.modal';
import ItemsCoreModal from './items.core.modal';
import { diveSampleIcon } from '../stores/items';

const ItemsDiveModal: FunctionComponent<{
  uuID?: string;
}> = ({ children, uuID }) => {
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
    >
      <Form>
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            search
            selection
            label="Cruise/Program"
            placeholder="Required"
            error
            options={[]}
          />
          <ItemsCruiseProgramModal>
            <Button primary fluid icon style={{ marginBottom: 2 }}>
              <Icon name="plus" />
            </Button>
          </ItemsCruiseProgramModal>
        </FormGridColumns>
        <Form.Field
          label="Deployment/Dive Type"
          control={() => (
            <ButtonGroup fluid>
              <Button primary>Deployment</Button>
              <Button>Dive</Button>
            </ButtonGroup>
          )}
        />
        <Form.Input
          fluid
          label="Deployment/Dive ID"
          placeholder="Required"
          error
        />
        <Form.Input fluid label="OSU ID" placeholder="Calculated" />
        <Form.Input fluid label="Deployment/Dive Notes" />
        <Form.Select
          fluid
          search
          selection
          allowAdditions
          label="Material"
          options={[]}
          placeholder="Required"
          error
        />
        <Form.Select
          fluid
          search
          selection
          allowAdditions
          label="Recovery Method"
          options={[]}
          placeholder="Required"
          error
        />
        <FormGridColumns widths={[10, 6]}>
          <Form.Input
            fluid
            label="Collection Start Date"
            placeholder="Required"
            error
          />
          <Form.Input fluid label="Local Time" placeholder="Required" error />
        </FormGridColumns>
        <FormGridColumns widths={[10, 6]}>
          <Form.Input fluid label="Collection End Date" />
          <Form.Input fluid label="Local Time" />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <>
            <Form.Input
              fluid
              label="Start Latitude"
              placeholder="Required"
              error
            />
            <Form.Input fluid label="End Latitude" />
            <Form.Input
              fluid
              label="Start Longitude"
              placeholder="Required"
              error
            />
            <Form.Input fluid label="End Longitude" />
          </>
          <></>
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <Form.Input
            fluid
            label="Start Water Depth (mbsl)"
            placeholder="Required"
            error
          />
          <Form.Input fluid label="End Water Depth (mbsl)" />
        </FormGridColumns>
        <FormGridColumns widths={[8, 8]}>
          <Form.Input fluid label="Area" />
          <Form.Input fluid label="Place" />
        </FormGridColumns>
        <Form.Select
          fluid
          search
          selection
          allowAdditions
          label="Contact PI Name"
          options={[]}
          placeholder="Required"
          error
        />
        <Form.Select
          fluid
          search
          selection
          allowAdditions
          label="Contact PI Institution"
          options={[]}
          placeholder="Required"
          error
        />
        <Form.Input
          fluid
          label="Contact PI Email"
          placeholder="Required"
          error
        />
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            multiple
            search
            selection
            label="Cores"
            options={[]}
          />
          <ItemsCoreModal>
            <Button primary fluid icon style={{ marginBottom: 2 }}>
              <Icon name="plus" />
            </Button>
          </ItemsCoreModal>
        </FormGridColumns>
        <FormGridColumns widths={[14, 2]}>
          <Form.Select
            fluid
            multiple
            search
            selection
            label="Rocks"
            options={[]}
          />
          <Button primary fluid icon style={{ marginBottom: 2 }}>
            <Icon name="plus" />
          </Button>
        </FormGridColumns>
      </Form>
    </Modal>
  );
};

export default ItemsDiveModal;
