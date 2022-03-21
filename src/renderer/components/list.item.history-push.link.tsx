import React, { FunctionComponent, ReactFragment } from 'react';
import { List, Icon, StrictIconProps } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { historyState } from '../stores/history';

const ListItemHistoryPushLink: FunctionComponent<{
  path: string;
  replacePath?: boolean;
  title: string | ReactFragment;
  icon?: StrictIconProps['name'];
  cornerIcon?: StrictIconProps['name'];
  disabled?: boolean;
}> = ({ children, path, replacePath, title, icon, cornerIcon, disabled }) => {
  const [history, setHistory] = useRecoilState(historyState);
  return (
    <List.Item
      as="a"
      onClick={() => {
        if (history.switching) return;
        if (replacePath && path !== history.locations[history.index].path)
          setHistory({
            ...history,
            locations: [...history.locations.slice(0, history.index), { path }],
          });
        else if (path !== history.locations[history.index].path)
          setHistory({
            ...history,
            index: history.index + 1,
            locations: [
              ...history.locations.slice(0, history.index + 1),
              { path },
            ],
          });
      }}
      disabled={disabled}
    >
      <List.Content floated="right">
        <Icon disabled size="big" color="grey" name="angle right" />
      </List.Content>
      {icon && (
        <List.Content floated="left">
          <Icon.Group size="big">
            <Icon name={icon} style={{ padding: 0, minWidth: '2.5rem' }} />
            {cornerIcon && <Icon corner name={cornerIcon} />}
          </Icon.Group>
        </List.Content>
      )}
      <List.Content style={icon ? { marginLeft: '3.75rem' } : {}}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <List.Description style={{ marginTop: '.5rem' }}>
          {children}
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

export default ListItemHistoryPushLink;
