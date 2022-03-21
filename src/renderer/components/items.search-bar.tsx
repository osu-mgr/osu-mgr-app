import _ from 'lodash';
import { FunctionComponent, useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Input, Button, Icon, Dropdown } from 'semantic-ui-react';
import { ItemsSearch, itemsSearchState } from '../stores/items';

const ItemsSearchBar: FunctionComponent<{
  plural: string;
  sortable?: true;
  margin?: string;
}> = ({ plural, sortable, margin = '1rem 0' }) => {
  const [search, setSearch] = useRecoilState(itemsSearchState);
  const [searchString, setSearchString] = useState(search.searchString);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((x: string) => {
      x = x.replace(/^http(s?):\/\/osu-mgr.org\//i, '');
      setSearch({ ...search, searchString: x });
    }, 500),
    [setSearch, search]
  );
  return (
    <Input
      fluid
      iconPosition="left"
      placeholder={`Search ${plural} ...`}
      style={{ margin }}
      value={searchString}
      onChange={(_event, data) => {
        setSearchString(data.value);
        debounce(data.value);
      }}
      action
    >
      <Icon name="search" />
      <input />
      <Button
        basic={searchString !== ''}
        icon="close"
        disabled={searchString === ''}
        onClick={() => {
          setSearch({ ...search, searchString: '' });
          setSearchString('');
        }}
      />
      {sortable && (
        <Dropdown
          button
          options={[
            {
              key: 'ids asc',
              value: 'ids asc',
              text: 'Names (Ordered)',
            },
            {
              key: 'ids desc',
              value: 'ids desc',
              text: 'Names (Reverse)',
            },
            {
              key: 'alpha asc',
              value: 'alpha asc',
              text: 'IDs (Ordered)',
            },
            {
              key: 'alpha desc',
              value: 'alpha desc',
              text: 'IDs (Reverse)',
            },
            {
              key: 'modified desc',
              value: 'modified desc',
              text: 'Recent First',
            },
            {
              key: 'modified asc',
              value: 'modified asc',
              text: 'Recent Last',
            },
          ]}
          value={search.sortOrder}
          onChange={(_event, data) =>
            setSearch({
              ...search,
              sortOrder: data.value as ItemsSearch['sortOrder'],
            })
          }
        />
      )}
    </Input>
  );
};

export default ItemsSearchBar;
