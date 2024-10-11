import { FunctionComponent, useState, useCallback, useEffect } from 'react';
import { List, Input, Grid, Button, Icon, Dropdown } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { useInView } from 'react-hook-inview';
import ListItemHistoryPushLink from './list.item.history-push.link';
import { filesSearchState, FilesSearch } from '../stores/files';

const FilesSearchBar: FunctionComponent<{
  plural: string;
}> = ({ plural }) => {
  const [search, setSearch] = useRecoilState(filesSearchState);
  const [searchString, setSearchString] = useState(search.searchString);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  const debounce = useCallback(
    _.debounce((x: string) => {
      x = x.replace(/^http(s?):\/\/osu-mgr.org\//i, '');
      setSearch({ ...search, searchString: x });
    }, 500),
    [setSearch, search]
  );
  useEffect(() => {
    if (!isVisible) {
      setSearchString(search.searchString);
    }
  }, [isVisible, search]);
  return (
    <Input
      fluid
      iconPosition="left"
      style={{ margin: '1rem 0' }}
      value={searchString}
      onChange={(_event, data) => {
        setSearchString(data.value);
        debounce(data.value);
      }}
      action
    >
      <div ref={ref} />
      <Icon name="search" />
      <input placeholder={`Search ${plural} ...`} />
      <Button
        basic={searchString !== ''}
        icon="close"
        disabled={searchString === ''}
        onClick={() => {
          setSearch({ ...search, searchString: '' });
          setSearchString('');
        }}
      />
      <Dropdown
        button
        options={[
          {
            key: 'alpha asc',
            value: 'alpha asc',
            text: 'Names (Ordered)',
          },
          {
            key: 'alpha desc',
            value: 'alpha desc',
            text: 'Names (Reverse)',
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
          {
            key: 'processed desc',
            value: 'processed desc',
            text: 'Processed First',
          },
          {
            key: 'processed asc',
            value: 'processed asc',
            text: 'Processed Last',
          },
        ]}
        value={search.sortOrder}
        onChange={(_event, data) =>
          setSearch({
            ...search,
            sortOrder: data.value as FilesSearch['sortOrder'],
          })
        }
      />
    </Input>
  );
};

const FilesPage: FunctionComponent = () => {
  return (
    <>
      <FilesSearchBar plural="Files" />
      <List relaxed divided>
        <Grid style={{ marginBottom: '.5rem' }}>
          <Grid.Column width={8}>
            <Button primary icon fluid>
              <Icon name="folder" /> Edit File Locations
            </Button>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button icon fluid>
              <Icon name="refresh" /> Refresh Results
            </Button>
          </Grid.Column>
        </Grid>
        <ListItemHistoryPushLink
          path="Metadata Sheets"
          title="Metadata Sheets"
          icon="file excel"
        >
          F:/Users/Core Lab/Collection/Holdings
          <br />
          F:/Users/Core Lab/Collection/ACC Holdings
        </ListItemHistoryPushLink>
        <ListItemHistoryPushLink
          path="Cruise Reports"
          title="Cruise Reports"
          icon="file pdf"
        >
          F:/Users/Core Lab/Collection/Holdings
          <br />
          F:/Users/Core Lab/Collection/ACC Holdings
        </ListItemHistoryPushLink>
        <ListItemHistoryPushLink path="Images" title="Images" icon="file image">
          F:/Users/Core Lab/Collection/Holdings
          <br />
          F:/Users/Core Lab/Collection/ACC Holdings
        </ListItemHistoryPushLink>
      </List>
    </>
  );
};

export default FilesPage;
