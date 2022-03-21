import { FunctionComponent } from 'react';
import { List, Breadcrumb, Divider } from 'semantic-ui-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { historyState } from '../stores/history';
import { loginState } from '../stores/accounts';
import LogInModal from './log-in.modal';
import AccountModal from './account.modal';

const Header: FunctionComponent = () => {
  const [history, setHistory] = useRecoilState(historyState);
  const login = useRecoilValue(loginState);
  const locations = history.locations.slice(0, history.index + 1);
  const sections = locations.map((location, index) => {
    return {
      key: location.path,
      content: location.path,
      onClick: () => setHistory({ ...history, index }),
    };
  });
  return (
    <>
      <List
        horizontal
        style={{
          position: 'fixed',
          left: '.5rem',
          top: '.5rem',
          width: 'calc(100vw - 1rem)',
          padding: 0,
          margin: 0,
        }}
      >
        <List.Item>
          <Breadcrumb icon="right angle" sections={sections} />
        </List.Item>
        {!login._uuid && (
          <LogInModal>
            <List.Item as="a" style={{ float: 'right' }}>
              <List.Icon name="key" />
              Log In
            </List.Item>
          </LogInModal>
        )}
        {login._uuid && (
          <AccountModal>
            <List.Item as="a" style={{ float: 'right' }}>
              <List.Icon name="user" />
              {login.name}
            </List.Item>
          </AccountModal>
        )}
      </List>
      <Divider
        fitted
        style={{
          position: 'fixed',
          left: '.5rem',
          bottom: 'calc(100vh - 2.5rem)',
          width: 'calc(100vw - 1rem)',
        }}
      />
    </>
  );
};

export default Header;
