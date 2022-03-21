import _ from 'lodash';
import { DateTime } from 'luxon';
import * as uuid from 'uuid';
import { FunctionComponent, useState } from 'react';
import { Button, Icon, Form, List, Label } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import Modal from './modal';
import ItemsRowsBlock from './items.item-rows-block';
import { Account, loginState } from '../stores/accounts';
import { Items } from '../stores/items';
import { accountPermissions } from '../common/vocabularies';
import { indexDocs } from '../common/es';

const AccountModal: FunctionComponent<{
  account?: Account;
}> = ({ children, account }) => {
  let [login, setLogin] = useRecoilState(loginState);
  if (account) [login, setLogin] = [account, () => {}];
  const [name, setName] = useState<string | undefined>(login?.name);
  const [nameError, setNameError] = useState<string | undefined>(
    (name || '').length > 0 ? undefined : 'Name cannot be empty.'
  );
  const [pin, setPin] = useState<string | undefined>(login?._pin);
  const [pinError, setPinError] = useState<string | undefined>(
    (pin || '').length < 4 ? 'Pin must be at least 4 numbers.' : undefined
  );
  const [confirmPin, setConfirmPin] = useState<string | undefined>('');
  const [confirmPinError, setConfirmPinError] = useState<string | undefined>(
    pin === login._pin || confirmPin === pin
      ? undefined
      : 'Confirmed pin must match pin.'
  );
  const [permissions, setPermissions] = useState<string[] | undefined>(
    login._permissions
  );

  const canSave =
    (name !== login.name ||
      pin !== login._pin ||
      !_.isEqual(
        [...(login._permissions || [])].sort(),
        [...(permissions || [])].sort()
      )) &&
    nameError === undefined &&
    pinError === undefined &&
    confirmPinError === undefined;

  return (
    <Modal
      trigger={children}
      icon="user"
      title={account ? 'Edit Account' : 'Account Settings'}
      buttons={(close) => (
        <>
          <Button
            primary
            icon
            disabled={!canSave}
            onClick={() => {
              const updatedAccount: Account = {
                ...login,
                name,
                _pin: pin,
                _permissions: [...(permissions || [])].sort(),
              };
              indexDocs([updatedAccount as Items]);
              if (!account) setLogin(updatedAccount);
              close();
            }}
          >
            <Icon name="save" /> Save
          </Button>
          {!account && (
            <Button
              primary={!canSave}
              icon
              onClick={() => {
                setLogin({});
                close();
              }}
            >
              <Icon name="log out" /> Log Out
            </Button>
          )}
        </>
      )}
    >
      <Form.Input
        fluid
        label="Name"
        error={nameError}
        value={name}
        onChange={(_e, data) => {
          setName(data.value);
          setNameError(
            data.value.length > 0 ? undefined : 'Name cannot be empty.'
          );
        }}
      />
      <Form.Input
        fluid
        label="Pin"
        type="password"
        error={pinError}
        value={pin}
        onChange={(_e, data) => {
          const pinNumbers = data.value.replace(/\D/g, '');
          setPin(pinNumbers);
          setPinError(
            pinNumbers.length < 4
              ? 'Pin must be at least 4 numbers.'
              : undefined
          );
          setConfirmPinError(
            pin === login._pin || confirmPin === pin
              ? undefined
              : 'Confirmed pin must match pin.'
          );
        }}
      />
      {pin !== login._pin && (
        <Form.Input
          fluid
          label="Confirm Pin"
          type="password"
          error={confirmPinError}
          value={confirmPin}
          onChange={(_e, data) => {
            const pinNumbers = data.value.replace(/\D/g, '');
            setConfirmPin(pinNumbers);
            setConfirmPinError(
              pin === login._pin || data.value === pin
                ? undefined
                : 'Confirmed pin must match pin.'
            );
          }}
        />
      )}
      <Form.Field label="Permissions" />
      <Form.Checkbox
        label="Edit Accounts"
        checked={login?._permissions?.includes('edit_accounts')}
        readOnly={!account}
        onChange={(_e, data) => {
          setPermissions(
            data.checked
              ? _.union(permissions, ['edit_accounts'])
              : _.difference(permissions, ['edit_accounts'])
          );
        }}
      />
      <Form.Checkbox
        label="Edit Items"
        checked={permissions?.includes('edit_items')}
        readOnly={!account && !login?._permissions?.includes('edit_accounts')}
        onChange={(_e, data) => {
          setPermissions(
            data.checked
              ? _.union(permissions, ['edit_items'])
              : _.difference(permissions, ['edit_items'])
          );
        }}
      />
      <Form.Checkbox
        label="Import Items"
        checked={permissions?.includes('import_items')}
        readOnly={!account && !login?._permissions?.includes('edit_accounts')}
        onChange={(_e, data) => {
          setPermissions(
            data.checked
              ? _.union(permissions, ['import_items'])
              : _.difference(permissions, ['import_items'])
          );
        }}
      />
      <Form.Checkbox
        label="Edit Storage"
        checked={permissions?.includes('edit_storage')}
        readOnly={!account && !login?._permissions?.includes('edit_accounts')}
        onChange={(_e, data) => {
          setPermissions(
            data.checked
              ? _.union(permissions, ['edit_storage'])
              : _.difference(permissions, ['edit_storage'])
          );
        }}
      />
      <Form.Checkbox
        label="Print Labels"
        checked={permissions?.includes('print_labels')}
        readOnly={!account && !login?._permissions?.includes('edit_accounts')}
        onChange={(_e, data) => {
          setPermissions(
            data.checked
              ? _.union(permissions, ['print_labels'])
              : _.difference(permissions, ['print_labels'])
          );
        }}
      />
      {!account && login?._permissions?.includes('edit_accounts') && (
        <>
          <Form.Field>
            <AccountModal
              account={{
                _docType: 'account',
                _uuid: uuid.v4(),
              }}
            >
              <Button as="div" icon primary fluid labelPosition="right">
                Create Account
                <Icon name="plus" />
              </Button>
            </AccountModal>
          </Form.Field>
          <Form.Field label="Edit Other Accounts" />
          <ItemsRowsBlock
            type="account"
            minRowHeight={50}
            from={0}
            size={10000}
            itemRow={(item) =>
              (item._source._uuid !== login._uuid && (
                <AccountModal account={item._source}>
                  <List.Item
                    as="a"
                    style={{ minHeight: 50 }}
                    key={item._source._uuid}
                  >
                    <List.Content>
                      {item._source._history && (
                        <Label
                          circular
                          size="mini"
                          basic
                          style={{ float: 'right', marginBottom: '-.5rem' }}
                        >
                          <Icon name="key" />
                          {DateTime.fromISO(
                            item._source._history[0].datetime || ''
                          ).toISODate()}
                          <Label.Detail>Last Logged In</Label.Detail>
                        </Label>
                      )}
                      <List.Header as="header">{item._source.name}</List.Header>
                      <List.Description>
                        {_.keys(accountPermissions)
                          .sort()
                          .map((permission) => (
                            <Label
                              circular
                              size="mini"
                              basic={
                                !item._source._permissions.includes(permission)
                              }
                              key={permission}
                              style={{
                                margin: '.5rem .5rem 0 0',
                              }}
                            >
                              <Icon
                                name={
                                  item._source._permissions.includes(permission)
                                    ? 'check circle'
                                    : 'remove circle'
                                }
                              />
                              {accountPermissions[permission]}&nbsp;&nbsp;
                            </Label>
                          ))}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                </AccountModal>
              )) || <></>
            }
          />
        </>
      )}
    </Modal>
  );
};

export default AccountModal;
