import _ from 'lodash';
import { DateTime } from 'luxon';
import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  Icon,
  List,
  Label,
  Divider,
  Form,
  Segment,
  Table,
  Header,
} from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import Modal from './modal';
import ItemsRowsBlock from './items.item-rows-block';
import { Account, loginState } from '../stores/accounts';
import { Items } from '../stores/items';
import { indexDocs } from '../common/es';
import { accountPermissions } from '../common/vocabularies';

const LogInModal: FunctionComponent = ({ children }) => {
  const [login, setLogin] = useRecoilState(loginState);
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | undefined>(undefined);

  return login._uuid ? (
    <>{children}</>
  ) : (
    <Modal
      trigger={children}
      icon="key"
      title="Log In"
      onClose={() => setAccount(undefined)}
      buttons={(close) => (
        <Button
          primary
          icon
          disabled={pin === ''}
          onClick={() => {
            if (pin === account?._pin) {
              const updatedAccount: Account = {
                ...account,
                _history: [
                  { datetime: DateTime.now().toISO() },
                  ...(account._history, []),
                ],
              };
              indexDocs([updatedAccount as Items]);
              setLogin(updatedAccount);
              close();
            } else {
              setPin('');
              setPinError('Incorrect Pin');
            }
          }}
        >
          <Icon name="key" /> Log In
        </Button>
      )}
    >
      {!account && (
        <>
          <Header>Log In as:</Header>
          <ItemsRowsBlock
            type="account"
            minRowHeight={50}
            from={0}
            size={10000}
            itemRow={(item) => (
              <List.Item
                as="a"
                style={{ minHeight: 50 }}
                key={item._source._uuid}
                onClick={() => {
                  setAccount(item._source);
                  setPin('');
                  setPinError(undefined);
                }}
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
            )}
          />
        </>
      )}
      {account && (
        <>
          <Button
            as="div"
            icon
            primary
            fluid
            labelPosition="right"
            onClick={() => {
              setAccount(undefined);
              setPin('');
              setPinError(undefined);
            }}
          >
            {account.name}
            <Icon name="close" />
          </Button>
          <Divider />
          <Form.Input
            fluid
            iconPosition="left"
            type="password"
            label="Enter Your Pin"
            onChange={(_e, data) => {
              setPin(data.value.replace(/\D/g, ''));
            }}
            value={pin}
            error={pinError}
            action
          >
            <Icon name="key" />
            <input />
            <Button
              as="div"
              basic={pin !== ''}
              icon="close"
              disabled={pin === ''}
              onClick={() => pin !== '' && setPin('')}
            />
          </Form.Input>
          <Segment basic textAlign="center">
            <Table
              basic="very"
              unstackable
              celled
              collapsing
              style={{ margin: 'auto' }}
            >
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}1`)}
                    >
                      1
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}2`)}
                    >
                      2
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}3`)}
                    >
                      3
                    </Button>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}4`)}
                    >
                      4
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}5`)}
                    >
                      5
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}6`)}
                    >
                      6
                    </Button>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}7`)}
                    >
                      7
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}8`)}
                    >
                      8
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}9`)}
                    >
                      9
                    </Button>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      icon="close"
                      size="large"
                      onClick={() => setPin('')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      onClick={() => setPin(`${pin}0`)}
                    >
                      0
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      as="div"
                      fluid
                      size="large"
                      style={{ paddingLeft: 0, paddingRight: 0 }}
                      onClick={() => setPin(pin.slice(0, -1))}
                    >
                      <FontAwesomeIcon icon={faBackspace} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Segment>
        </>
      )}
    </Modal>
  );
};

export default LogInModal;
