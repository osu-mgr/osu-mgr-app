import React, { FunctionComponent } from 'react';
import { Button, Icon, Form } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import Modal from './modal';
import { accountsState, loginState } from '../stores/accounts';

const AccountModal: FunctionComponent = ({ children }) => {
  const accounts = useRecoilValue(accountsState);
  const login = useRecoilValue(loginState);
  return (
    <Modal
      trigger={children}
      icon="user"
      title="Account Settings"
      buttons={() => (
        <>
          <Button primary icon>
            <Icon name="log out" /> Log Out
          </Button>
          <Button primary disabled icon>
            <Icon name="save" /> Save
          </Button>
        </>
      )}
    >
      <Form>
        <Form.Input fluid label="Name" value={accounts[login].name} />
        <Form.Input fluid label="Pin" value="****" />
      </Form>
    </Modal>
  );
};

export default AccountModal;
