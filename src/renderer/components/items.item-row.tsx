import _ from 'lodash';
import { DateTime } from 'luxon';
import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useInView } from 'react-hook-inview';
import { List, Icon, Loader, Label } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import { itemByUUID } from '../common/es';
import { matchesFieldNames } from '../common/vocabularies';
import { Account } from '../stores/accounts';
import { Item, itemsSearchState } from '../stores/items';

const ItemsItemRow: FunctionComponent<{
  item: Item;
  title: string;
  labels?: Record<string, string>[];
  matches?: Record<string, string>;
}> = ({ item, title, labels, matches }) => {
  const isMounted = useMountedState();
  const search = useRecoilValue(itemsSearchState);
  const [editAccount, setEditAccount] = useState<Account | undefined>(
    undefined
  );
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    setEditAccount(undefined);
  }, [item]);
  useEffect(() => {
    if (editAccount === undefined && isVisible)
      (async () => {
        const update = (await itemByUUID(
          item?._history[0].login || ''
        )) as unknown as Account;
        if (isMounted()) setEditAccount(update);
      })();
  }, [isMounted, isVisible, editAccount, item]);

  const searchStrings = search.searchString.toLowerCase().split(/\s+/);
  const reMatchSplit = new RegExp(
    `(${searchStrings
      .map((x) => x.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'))
      .join('|')})`,
    'ig'
  );
  const matchesFields = _.keys(matches).map((x) => matchesFieldNames[x]);
  return (
    <>
      <List.Content>
        <Label circular size="mini" basic style={{ float: 'right' }}>
          <Icon name="edit outline" />
          <span ref={ref}>
            {DateTime.fromISO(item?._history[0].datetime || '').toISODate()}
          </span>
          <Label.Detail>
            by{' '}
            {editAccount !== undefined ? (
              editAccount.name
            ) : (
              <Loader className="inline-loader" active inline />
            )}
          </Label.Detail>
        </Label>
        <List.Header as="header">{title}</List.Header>
        <List.Description>
          {Object.keys(matchesFieldNames).map((label, i) =>
            label[0] != '_' &&
            item &&
            item[label.replace('.substring', '')] &&
            !matchesFields.includes(label.replace('.substring', '')) ? (
              <Label
                key={i}
                basic
                circular
                size="mini"
                style={{
                  margin: '.5rem .5rem 0 0',
                }}
              >
                &nbsp;&nbsp;{matchesFieldNames[label]}:
                <Label.Detail>
                  {item && item[label.replace('.substring', '')]}
                </Label.Detail>
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
                <Label.Detail>
                  {matches[field][0]
                    .split(reMatchSplit)
                    .map((x: string, i: number) =>
                      searchStrings.includes(x.toLowerCase()) ? (
                        <span key={i} className="highlight">
                          {x}
                        </span>
                      ) : (
                        <span key={i}>{x}</span>
                      )
                    )}
                </Label.Detail>
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
            ))}{' '}
          {item?._warnings &&
            item._warnings.map((warning) => (
              <Label
                circular
                size="mini"
                key={warning}
                style={{
                  color: '#F2711C',
                  margin: '.5rem .5rem 0 0',
                }}
              >
                <Icon name="times circle" style={{ color: '#F2711C' }} />
                Warning:
                <Label.Detail>{warning}</Label.Detail>
              </Label>
            ))}
        </List.Description>
      </List.Content>
    </>
  );
};

export default ItemsItemRow;
