import _ from 'lodash';
import { FunctionComponent, useState, useCallback, useEffect } from 'react';
import {
  Input,
  List,
  Button,
  ButtonGroup,
  Icon,
  Dropdown,
  SemanticICONS,
} from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { useInView } from 'react-hook-inview';
import useMountedState from '../common/useMountedState';
import ListItemHistoryPushLink from './list.item.history-push.link';
import PageScroll from './page-scroll';
import LocationsCount from './locations.count';
import LocationsMap from './locations.map';
import LocationsZone from './locations.zone';
import LocationsRack from './locations.rack';
import LocationsPosition from './locations.position';
import LocationsFilterLabels from './locations.filter-labels';
import {
  locationAreas,
  locationRackNames,
  locationPositionNames,
  locationSlotNames,
  locationPrefixesName,
  locationPrefixesIcon,
  locationPrefixesCornerIcon,
} from '../common/storageLocations';
import { countByLocation } from '../common/es';
import { locationsSearchState, LocationsSearch } from '../stores/locations';
import ItemsSectionHalfModal from './items.section-half.modal';
import ItemsItemRow from './items.item-row';
import LocationsRowsBlock from './locations.item-rows-block';

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
  }, [isVisible, search]);
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

const LocationsAddItem: FunctionComponent<{ location: string }> = ({
  location,
}) => {
  const [osuID, setOSUID] = useState('');
  const debounce = useCallback(
    _.debounce((x: string) => {
      x = x.replace(/^http(s?):\/\/osu-mgr.org\//i, '');
    }, 500),
    [setOSUID, osuID]
  );
  return (
    <Input
      fluid
      iconPosition="left"
      placeholder={`Add Item to Location ...`}
      style={{ margin: '1rem 0' }}
      value={osuID}
      onChange={(_event, data) => {
        console.log('Setting location for', data.value, 'to', location);
        setOSUID(data.value);
        debounce(data.value);
      }}
      action
    >
      <Icon name="plus" />
      <input />
      <Button
        basic={osuID !== ''}
        icon="close"
        disabled={osuID === ''}
        onClick={() => {
          setOSUID('');
        }}
      />
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
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    setItemsCount(undefined);
    if (isMounted())
      (async () => {
        const update = await countByLocation(
          location,
          rack,
          position,
          slot,
          search
        );
        if (isMounted()) setItemsCount(update);
      })();
  }, [isMounted, search]);

  const view = search.view !== 'items' && slot ? 'items' : search.view;

  console.log('LocationsPage', location, rack, position, slot, view, search);
  return (
    <>
      <LocationsSearchBar plural="Items" />
      <ButtonGroup fluid size="mini">
        <Button
          icon
          primary={view == 'locations'}
          onClick={() => {
            setSearch({ ...search, view: 'locations' });
          }}
          disabled={slot !== undefined}
        >
          <Icon name="warehouse" />
          <Button.Content>Locations</Button.Content>
        </Button>
        <Button
          icon
          primary={view == 'items'}
          onClick={() => {
            setSearch({ ...search, view: 'items' });
          }}
        >
          <Icon name="list layout" />
          <Button.Content>
            <LocationsCount
              location={location}
              rack={rack}
              position={position}
              slot={slot}
              label="Items"
            />
          </Button.Content>
        </Button>
        <Button
          icon
          primary={view == 'map'}
          onClick={() => {
            setSearch({ ...search, view: 'map' });
          }}
          disabled={slot !== undefined}
        >
          <Icon name="map outline" />
          <Button.Content>Map</Button.Content>
        </Button>
      </ButtonGroup>
      <ButtonGroup fluid size="mini">
        <Button
          size="mini"
          primary={search.filter == 'recent'}
          style={{
            marginTop: '1em',
            color: search.filter == 'recent' ? 'white' : 'rgba(0, 0, 0, 0.75)',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'recent' ? undefined : 'recent',
            });
          }}
        >
          <Icon
            name="edit"
            style={{
              color:
                search.filter == 'recent' ? 'white' : 'rgba(0, 0, 0, 0.75)',
            }}
          />
          <LocationsCount
            location={location}
            rack={rack}
            position={position}
            slot={slot}
            label="Recents"
            filter="recent"
            inverted={search.filter == 'recent'}
          />
        </Button>
        <Button
          size="mini"
          primary={search.filter == 'valid'}
          style={{
            marginTop: '1em',
            color: search.filter == 'valid' ? 'white' : '#2C662D',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'valid' ? undefined : 'valid',
            });
          }}
        >
          <Icon
            name="check circle"
            style={{ color: search.filter == 'valid' ? 'white' : '#2C662D' }}
          />
          <LocationsCount
            location={location}
            rack={rack}
            position={position}
            slot={slot}
            label="Valid"
            filter="valid"
            inverted={search.filter == 'valid'}
          />
        </Button>
        <Button
          size="mini"
          primary={search.filter == 'warning'}
          style={{
            marginTop: '1em',
            color: search.filter == 'warning' ? 'white' : '#F2711C',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'warning' ? undefined : 'warning',
            });
          }}
        >
          <Icon
            name="exclamation circle"
            style={{ color: search.filter == 'warning' ? 'white' : '#F2711C' }}
          />
          <LocationsCount
            location={location}
            rack={rack}
            position={position}
            slot={slot}
            label="Warnings"
            filter="warning"
            inverted={search.filter == 'warning'}
          />
        </Button>
        <Button
          size="mini"
          primary={search.filter == 'error'}
          style={{
            marginTop: '1em',
            color: search.filter == 'error' ? 'white' : '#9F3A38',
          }}
          onClick={() => {
            setSearch({
              ...search,
              filter: search.filter === 'error' ? undefined : 'error',
            });
          }}
        >
          <Icon
            name="times circle"
            style={{ color: search.filter == 'error' ? 'white' : '#9F3A38' }}
          />
          <LocationsCount
            location={location}
            rack={rack}
            position={position}
            slot={slot}
            label="Errors"
            filter="error"
            inverted={search.filter == 'error'}
          />
        </Button>
      </ButtonGroup>
      <List relaxed divided style={{ marginTop: '0.5em' }}>
        <List.Item></List.Item>
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
          locationRackNames[location].map((x) => (
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
          locationPositionNames[location][rack].map((x) => (
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
        {(search.view == 'locations' &&
          location &&
          rack &&
          position &&
          !slot && (
            <PageScroll
              pageSize={10}
              rows={locationSlotNames[location][rack][position].map((x) => (
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
            />
          )) ||
          ''}
      </List>
      {search.view == 'map' && !location && <LocationsMap />}
      {search.view == 'map' && location && !rack && (
        <LocationsZone zone={location} />
      )}
      {search.view == 'map' && location && rack && !position && (
        <LocationsRack zone={location} rack={rack} />
      )}
      {search.view == 'map' && location && rack && position && !slot && (
        <LocationsPosition zone={location} rack={rack} position={position} />
      )}
      {((search.view == 'items' || (location && rack && position && slot)) &&
        itemsCount !== undefined && (
          <>
            {location && rack && position && slot && (
              <LocationsAddItem
                location={`${location}-${rack}-${position}-${slot}`}
              />
            )}
            <PageScroll
              pageSize={10}
              rows={[...Array(Math.ceil(itemsCount / 10)).keys()].map((i) => (
                <LocationsRowsBlock
                  key={`item_${i}`}
                  minRowHeight={50}
                  from={i * 10}
                  size={10}
                  location={location}
                  rack={rack}
                  position={position}
                  slot={slot}
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
                        />
                      </List.Item>
                    </ItemsSectionHalfModal>
                  )}
                />
              ))}
            />
          </>
        )) ||
        ''}
    </>
  );
};

export default LocationsPage;
