import _ from 'lodash';
import { DateTime } from 'luxon';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { List, Icon, Loader, Label } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import { searchByType } from '../es';
import {
  Account,
  matchesFieldNames,
  itemsSearchState,
  Item,
} from '../stores/items';

const ItemsItemRow: FunctionComponent<{
  item: Item;
  title: string;
  labels?: Record<string, string>[];
  matches?: Record<string, string>[];
}> = ({ item, title, labels, matches }) => {
  const search = useRecoilValue(itemsSearchState);
  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined);

  useEffect(() => {
    setAccounts(undefined);
    (async () => {
      setAccounts(
        (await searchByType('account')).map(
          (x) => x._source
        ) as unknown as Account[]
      );
    })();
  }, [search]);
  return (
    <>
      <List.Content>
        <Label circular size="mini" basic style={{ float: 'right' }}>
          <Icon name="edit outline" />
          {DateTime.fromISO(item?._history[0].datetime || '').toISODate()}
          <Label.Detail>
            by{' '}
            {accounts !== undefined ? (
              accounts.filter((x) => x._uuid === item?._history[0].login)[0]
                .name
            ) : (
              <Loader className="inline-loader" active inline />
            )}
          </Label.Detail>
        </Label>
        <List.Header as="header">{title}</List.Header>
        <List.Description>
          {labels &&
            labels.map((label, i) =>
              label.value !== undefined && label.value !== '' ? (
                <Label
                  key={i}
                  basic
                  circular
                  size="mini"
                  style={{
                    margin: '.5rem .5rem 0 0',
                  }}
                >
                  &nbsp;&nbsp;{label.value}
                  {label.detail !== undefined && label.detail !== '' ? (
                    <Label.Detail>{label.detail}</Label.Detail>
                  ) : (
                    <>&nbsp;&nbsp;</>
                  )}
                </Label>
              ) : undefined
            )}
        </List.Description>
        <List.Description>
          {matches &&
            _.keys(matches).map((field) => (
              <Label
                circular
                size="mini"
                key={field}
                style={{ margin: '.5rem .5rem 0 0' }}
              >
                <Icon name="search" />
                {matchesFieldNames[field]}:
                <Label.Detail>{matches[field]}</Label.Detail>
              </Label>
            ))}
          {item?._errors &&
            item._errors.map((error) => (
              <Label
                circular
                size="mini"
                key={error}
                style={{
                  color: '#9F3A38',
                  margin: '.5rem .5rem 0 0',
                }}
              >
                <Icon name="times circle" style={{ color: '#9F3A38' }} />
                Error:
                <Label.Detail>{error}</Label.Detail>
              </Label>
            ))}
        </List.Description>
      </List.Content>
    </>
  );
};

export default ItemsItemRow;
