import _ from 'lodash';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Icon, Form } from 'semantic-ui-react';
import Modal from './modal';
import FormGridColumns from './form.grid.columns';
// eslint-disable-next-line import/no-cycle
import ItemsCoreModal from './items.core.modal';
// eslint-disable-next-line import/no-cycle
import ItemsDiveModal from './items.dive.modal';
import { itemByUUID, countByUUIDs } from '../es';
import OSUID from './osu.id';
import { Cruise, cruiseIcon, loginState } from '../stores/items';
import ItemsChildrenBlock from './items.item-children-block';
import ItemsFormInput from './items.form.input';
import ItemsPrintLabelsModal from './items.print-labels.modal';

const ItemsCruiseProgramModal: FunctionComponent<{
  uuid?: string;
}> = ({ children, uuid }) => {
  const login = useRecoilValue(loginState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cruise, setCruise] = useState<Cruise | undefined>(undefined);
  const [coresCount, setCoresCount] = useState<number | undefined>(undefined);
  const [divesCount, setDivesCount] = useState<number | undefined>(undefined);
  useEffect(() => {
    setCruise(undefined);
  }, [uuid]);
  useEffect(() => {
    if (isOpen && uuid !== undefined)
      (async () => {
        setCruise((await itemByUUID(uuid)) as Cruise);
      })();
  }, [uuid, isOpen]);
  useEffect(() => {
    if (
      isOpen &&
      uuid !== undefined &&
      cruise !== undefined &&
      cruise._cruiseUUID !== undefined
    )
      (async () => {
        setCoresCount(await countByUUIDs([cruise._cruiseUUID || ''], 'core'));
      })();
  }, [uuid, isOpen, cruise]);
  useEffect(() => {
    if (
      isOpen &&
      uuid !== undefined &&
      cruise !== undefined &&
      cruise._cruiseUUID !== undefined
    )
      (async () => {
        setDivesCount(await countByUUIDs([cruise._cruiseUUID || ''], 'dive'));
      })();
  }, [uuid, isOpen, cruise]);
  return (
    <Modal
      trigger={children}
      icon={cruiseIcon}
      title="Cruise/Program"
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
        <ItemsFormInput
          label="Cruise/Program ID"
          placeholder="Required"
          error={cruise?.id === undefined || cruise?.id === ''}
          value={cruise?.id || ''}
        />
        <ItemsFormInput
          label="OSU ID (calculated)"
          value={cruise?.id !== '' && `OSU-${cruise?.id}`}
        />
        <ItemsFormInput
          label="R2R Cruise ID"
          value={cruise?.r2rCruiseID || ''}
        />
        <ItemsFormInput fluid label="RV Name" value={cruise?.rvName || ''} />
        <ItemsFormInput label="Collection" value={cruise?.collection || ''} />
        <ItemsFormInput
          label="Cruise/Program Name"
          value={cruise?.name || ''}
        />
        <ItemsFormInput
          fluid
          label="Principal Investigator"
          placeholder="Required"
          error={cruise?.pi === undefined || cruise.pi === ''}
          value={cruise?.pi || ''}
        />
        <ItemsFormInput
          label="Principal Investigator Institution"
          value={cruise?.piInstitution || ''}
        />
        <ItemsFormInput
          fluid
          label="Principal Investigator Email"
          value={cruise?.piEmail || ''}
        />
        <ItemsFormInput
          label="Cruise/Program Notes"
          value={cruise?.notes || ''}
        />
        <Form.Field style={{ marginBottom: 0 }}>
          <label>{(coresCount && `${coresCount} `) || ''}Cores</label>
        </Form.Field>
        {[...Array(Math.max(1, Math.ceil((coresCount || 1) / 10))).keys()].map(
          (i) => (
            <ItemsChildrenBlock
              key={i}
              uuid={(cruise && cruise._cruiseUUID) || ''}
              type="core"
              from={i * 10}
              size={10}
              minRowHeight={30}
              itemRow={(item) => (
                <FormGridColumns key={item._uuid} widths={[2, 12, 2]}>
                  <ItemsCoreModal uuid={item._uuid}>
                    <Button primary fluid icon style={{ marginBottom: 2 }}>
                      <Icon name="edit" />
                    </Button>
                  </ItemsCoreModal>
                  <Form.Input fluid readOnly value={item._osuid} />
                  <Button primary fluid icon style={{ marginBottom: 2 }}>
                    <Icon name="delete" />
                  </Button>
                </FormGridColumns>
              )}
            />
          )
        )}
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
                text: <OSUID uuIDs={{ core: x }} />,
              };
            })}
          />
          <ItemsDiveModal>
            <Button primary fluid icon style={{ marginBottom: 2 }}>
              <Icon name="plus" />
            </Button>
          </ItemsDiveModal>
        </FormGridColumns>
        <Form.Field style={{ marginBottom: 0 }}>
          <label>{(divesCount && `${divesCount} `) || ''}Dives</label>
        </Form.Field>
        {[...Array(Math.max(1, Math.ceil((divesCount || 1) / 10))).keys()].map(
          (i) => (
            <ItemsChildrenBlock
              key={i}
              uuid={cruise?._cruiseUUID || ''}
              type="dive"
              from={i * 10}
              size={10}
              minRowHeight={30}
              itemRow={(item) => (
                <FormGridColumns key={item._uuid} widths={[2, 12, 2]}>
                  <ItemsDiveModal uuid={item._uuid}>
                    <Button primary fluid icon style={{ marginBottom: 2 }}>
                      <Icon name="edit" />
                    </Button>
                  </ItemsDiveModal>
                  <Form.Input fluid readOnly value={item._osuid} />
                  <Button primary fluid icon style={{ marginBottom: 2 }}>
                    <Icon name="delete" />
                  </Button>
                </FormGridColumns>
              )}
            />
          )
        )}
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
                text: <OSUID uuIDs={{ dive: x }} />,
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

export default ItemsCruiseProgramModal;
