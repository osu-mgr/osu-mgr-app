import React, { FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import { Input, Button, Icon, Dropdown } from 'semantic-ui-react';
import { ItemsSearch, itemsSearchState } from '../stores/items';

const ItemsSearchBar: FunctionComponent<{
  plural: string;
  sortable?: true;
}> = ({ plural, sortable }) => {
  const [search, setSearch] = useRecoilState(itemsSearchState);
  return (
    <Input
      fluid
      iconPosition="left"
      placeholder={`Search ${plural} ...`}
      style={{ margin: '1rem 0' }}
      value={search.searchString}
      onChange={(_, data) => {
        setSearch({ ...search, searchString: data.value });
      }}
      action
    >
      <Icon name="search" />
      <input />
      <Button
        basic={search.searchString !== ''}
        icon="close"
        disabled={search.searchString === ''}
        onClick={() =>
          search.searchString !== '' &&
          setSearch({ ...search, searchString: '' })
        }
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
          onChange={(_, data) =>
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
