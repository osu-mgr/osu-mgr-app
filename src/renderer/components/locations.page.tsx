import _ from 'lodash';
import { FunctionComponent, useState, useCallback, useEffect } from 'react';
import {
  Input,
  List,
  Button,
  Icon,
  Grid,
  Dropdown,
  SemanticICONS,
} from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { useInView } from 'react-hook-inview';
import useMountedState from '../common/useMountedState';
import ListItemHistoryPushLink from './list.item.history-push.link';
import LocationsCount from './locations.count';
import LocationsFilterLabels from './locations.filter-labels';
import {
  locationAreas,
  locationRacks,
  locationPositions,
  locationSlots,
  locationPrefixesName,
  locationPrefixesIcon,
  locationPrefixesCornerIcon,
} from '../common/storageLocations';
import { countByType } from '../common/es';
import { locationsSearchState, LocationsSearch } from '../stores/locations';
import ItemsSectionHalfModal from './items.section-half.modal';
import ItemsItemRow from './items.item-row';
import ItemsRowsBlock from './items.item-rows-block';

const LocationsSearchBar: FunctionComponent<{
  plural: string;
}> = ({ plural }) => {
  const [search, setSearch] = useRecoilState(locationsSearchState);
  const [searchString, setSearchString] = useState(search.searchString);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  const debounce = useCallback(
    _.debounce((x: string) => {
      x = x.replace(/^http(s?):\/\/osu-mgr.org\//i, '');
      console.log('Setting search.searchString to ', x);
      setSearch({ ...search, searchString: x });
    }, 500),
    [setSearch, search]
  );
  useEffect(() => {
    if (!isVisible) {
      setSearchString(search.searchString);
    }
  }, [setSearchString, search]);
  return (
    <Input
      fluid
      iconPosition="left"
      placeholder={`Search ${plural} ...`}
      style={{ margin: '1rem 0' }}
      value={searchString}
      onChange={(_event, data) => {
        console.log('Setting searchString to ', data.value);
        setSearchString(data.value);
        debounce(data.value);
      }}
      action
    >
      <div ref={ref} />
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
      {search.view === 'items' && (
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
              sortOrder: data.value as LocationsSearch['sortOrder'],
            })
          }
        />
      )}
      {search.view === 'locations' && (
        <Button
          primary
          icon
          onClick={() => setSearch({ ...search, hideEmpty: !search.hideEmpty })}
        >
          <Icon name={search.hideEmpty ? 'circle outline' : 'ban'} />
          <Button.Content>
            {search.hideEmpty ? ' Show' : ' Hide'} Empty
          </Button.Content>
        </Button>
      )}
    </Input>
  );
};

const ListItemCounts: FunctionComponent<{
  icon?: SemanticICONS;
  cornerIcon?: SemanticICONS;
  location: string;
  rack?: string;
  position?: string;
  slot?: string;
  title: string;
  disabled?: boolean;
  hideEmpty?: boolean;
}> = ({
  icon,
  cornerIcon,
  location,
  rack,
  position,
  slot,
  title,
  disabled,
  hideEmpty,
}) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  if (hideEmpty && count === 0) return <></>;
  return (
    <ListItemHistoryPushLink
      path={slot || position || rack || location}
      title={
        <>
          <span style={{ color: 'black' }}>
            <LocationsCount
              location={location}
              rack={rack}
              position={position}
              slot={slot}
              singular="Item in "
              plural="Items in "
              onCount={(x) => setCount(x)}
            />
          </span>
          {title}
        </>
      }
      icon={icon}
      cornerIcon={cornerIcon}
      disabled={disabled}
    >
      <LocationsFilterLabels
        location={location}
        rack={rack}
        position={position}
        slot={slot}
      />
    </ListItemHistoryPushLink>
  );
};

const LocationsPage: FunctionComponent<{
  location?: string;
  rack?: string;
  position?: string;
  slot?: string;
}> = ({ location, rack, position, slot }) => {
  const isMounted = useMountedState();
  const [search, setSearch] = useRecoilState(locationsSearchState);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const [maxPages, setMaxPages] = useState<number>(1);

  const pageSize = 10;

  useEffect(() => {
    setItemsCount(undefined);
    if (isMounted())
      (async () => {
        const update = await countByType('sectionHalf', search);
        if (isMounted()) setItemsCount(update);
      })();
  }, [isMounted, search]);
  useEffect(() => {
    if (
      isMounted() &&
      isVisible &&
      itemsCount &&
      itemsCount / pageSize > maxPages
    )
      setMaxPages(maxPages + 1);
  }, [isMounted, isVisible, itemsCount, maxPages]);

  console.log(
    'LocationPage',
    isMounted(),
    isVisible,
    itemsCount,
    maxPages,
    location,
    rack,
    position,
    slot
  );
  return (
    <>
      <LocationsSearchBar plural="Items" />
      <Grid style={{ marginTop: '1em', marginBottom: '1em' }} columns={3}>
        <Grid.Column style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Button
            fluid
            icon
            primary={search.view == 'locations'}
            onClick={() => {
              setMaxPages(1);
              setSearch({ ...search, view: 'locations' });
            }}
          >
            <Icon name="warehouse" />
            <Button.Content>Locations</Button.Content>
          </Button>
        </Grid.Column>
        <Grid.Column style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Button
            fluid
            icon
            primary={search.view == 'items'}
            onClick={() => {
              setMaxPages(1);
              setSearch({ ...search, view: 'items' });
            }}
          >
            <Icon name="list layout" />
            <Button.Content>Items</Button.Content>
          </Button>
        </Grid.Column>
        <Grid.Column style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Button primary fluid icon disabled>
            <Icon name="map outline" />
            <Button.Content>Map</Button.Content>
          </Button>
        </Grid.Column>
      </Grid>
      <List relaxed divided>
        <List.Item>
          <List.Content floated="left">
            <Icon.Group size="big">
              <Icon
                name="list layout"
                style={{ padding: 0, minWidth: '2.5rem' }}
              />
            </Icon.Group>
          </List.Content>
          <List.Content style={{ marginLeft: '3.75rem' }}>
            <h3 style={{ margin: 0 }}>
              <LocationsCount
                location={location}
                rack={rack}
                position={position}
                slot={slot}
                singular="Item"
                plural="Items"
              />
            </h3>
            <List.Description style={{ marginTop: '.5rem' }}>
              <LocationsFilterLabels
                location={location}
                rack={rack}
                position={position}
                slot={slot}
              />
            </List.Description>
          </List.Content>
        </List.Item>
        {search.view == 'locations' &&
          !location &&
          locationAreas.map((x) => (
            <ListItemCounts
              key={`location_${x}`}
              title={locationPrefixesName[x]}
              icon={locationPrefixesIcon[x]}
              cornerIcon={locationPrefixesCornerIcon[x]}
              location={x}
              hideEmpty={search.hideEmpty}
            />
          ))}
        {search.view == 'locations' &&
          location &&
          !rack &&
          locationRacks[location].map((x) => (
            <ListItemCounts
              key={`rack_${x}`}
              title={`${location}-${x}`}
              icon={locationPrefixesIcon[location]}
              cornerIcon={locationPrefixesCornerIcon[location]}
              location={location}
              rack={x}
              hideEmpty={search.hideEmpty}
            />
          ))}
        {search.view == 'locations' &&
          location &&
          rack &&
          !position &&
          locationPositions[location][rack].map((x) => (
            <ListItemCounts
              key={`position_${x}`}
              title={`${location}-${rack}-${x}`}
              icon={locationPrefixesIcon[location]}
              cornerIcon={locationPrefixesCornerIcon[location]}
              location={location}
              rack={rack}
              position={x}
              hideEmpty={search.hideEmpty}
            />
          ))}
        {search.view == 'locations' &&
          location &&
          rack &&
          position &&
          !slot &&
          locationSlots[location][rack][position].map((x) => (
            <ListItemCounts
              key={`slot_${x}`}
              title={`${location}-${rack}-${position}-${x}`}
              icon={locationPrefixesIcon[location]}
              cornerIcon={locationPrefixesCornerIcon[location]}
              location={location}
              rack={rack}
              position={position}
              slot={x}
              hideEmpty={search.hideEmpty}
            />
          ))}
      </List>
      {(search.view == 'items' &&
        itemsCount &&
        [...Array(maxPages).keys()].map((i) => (
          <ItemsRowsBlock
            type={'sectionHalf'}
            key={`item_${i}`}
            minRowHeight={50}
            from={i * pageSize}
            size={pageSize}
            itemRow={(hit) => (
              <ItemsSectionHalfModal
                uuid={hit._source._uuid}
                key={hit._source._uuid}
              >
                <List.Item as="a" style={{ minHeight: 50 }}>
                  <ItemsItemRow
                    item={hit._source}
                    matches={hit.highlight}
                    title={hit._source._osuid}
                    labels={[
                      { label: '', value: hit._source.name },
                      {
                        label: '',
                        value: hit._source.rvName,
                      },
                    ]}
                  />
                </List.Item>
              </ItemsSectionHalfModal>
            )}
          />
        ))) ||
        ''}
      {(search.view == 'items' &&
        itemsCount &&
        itemsCount / pageSize > maxPages && (
          <div ref={ref} style={{ minHeight: 50 }} />
        )) ||
        ''}
    </>
  );
};

export default LocationsPage;
