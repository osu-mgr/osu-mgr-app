import _ from 'lodash';
import {
  FunctionComponent,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { BsQrCodeScan } from 'react-icons/bs';
import {
  Input,
  List,
  Button,
  ButtonGroup,
  Icon,
  Dropdown,
  SemanticICONS,
} from 'semantic-ui-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loginState } from '../stores/accounts';
import LogInModal from './log-in.modal';
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
import { countByLocation, searchByLocation } from '../common/es';
import { historyState } from '../stores/history';
import { locationsSearchState, LocationsSearch } from '../stores/locations';
import ItemsSectionHalfModal from './items.section-half.modal';
import ItemsItemRow from './items.item-row';
import LocationsRowsBlock from './locations.item-rows-block';
import { Hit, searchByOSUIDPrefix, indexDocs } from '../common/es';
import { SectionHalf, DiveSample } from 'renderer/stores/items';

const LocationsSearchBar: FunctionComponent<{
  plural: string;
  location?: string;
  rack?: string;
  position?: string;
  slot?: string;
}> = ({ plural, location, rack, position, slot }) => {
  const [search, setSearch] = useRecoilState(locationsSearchState);
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
      action
    >
      <div ref={ref} />
      <Icon name="search" />
      <textarea
        rows={1}
        style={{ resize: 'none' }}
        placeholder={`Search ${plural} ...`}
        value={search.searchString}
        onChange={(element) => {
          setSearch({ ...search, searchString: element.target.value });
          debounce(element.target.value);
        }}
      />
      <Button
        icon="close"
        disabled={search.searchString === ''}
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
              text: 'IDs (Ordered)',
            },
            {
              key: 'ids desc',
              value: 'ids desc',
              text: 'IDs (Reverse)',
            },
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
      <Button
        primary={search.searchString !== ''}
        icon="save"
        disabled={search.searchString === ''}
        onClick={async () => {
          const items = await searchByLocation(location, rack, position, slot, {
            ...search,
            sortOrder: 'ids asc',
          });
          const data = items.map((x) => {
            const hit = x._source as SectionHalf | DiveSample;
            return [hit._osuid, hit.storageLocation, hit.weight];
          });
          const csv = data.map((x) => x.join(',')).join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const date_time = new Date()
            .toISOString()
            .replace(/T/g, ' ')
            .replace(/[:]/g, '-')
            .split('.')[0];
          a.href = url;
          a.download = `OSU-MGR App Storage Locations and Weights - ${date_time}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      />
      <Button
        primary={search.searchString !== ''}
        icon="copy"
        disabled={search.searchString === ''}
        onClick={async () => {
          const items = await searchByLocation(location, rack, position, slot, {
            ...search,
            sortOrder: 'ids asc',
          });
          const data = items.map((x) => {
            const hit = x._source as SectionHalf | DiveSample;
            return [hit._osuid, hit.storageLocation, hit.weight];
          });
          const tsv = data.map((x) => x.join('\t')).join('\n');
          navigator.clipboard.writeText(tsv);
        }}
      />
      {false && search.view === 'locations' && (
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

const LocationsAddItem: FunctionComponent<{ location: string; onChange? }> = ({
  location,
  onChange,
}) => {
  const textareaRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [itemID, setItemID] = useState('');
  const [matchedItems, setMatchedItems] = useState<Hit[]>([]);
  const [changeOnMatch, setChangeOnMatch] = useState(false);
  const login = useRecoilValue(loginState);
  const reset = () => {
    setInputValue('');
    setItemID('');
    setMatchedItems([]);
    setChangeOnMatch(false);
  };
  const debounce = useCallback(
    _.debounce((x: string) => {
      x = x.replace(/^http(s?):\/\/osu-mgr.org\//i, '');
      if (x.endsWith('\n') || x.endsWith('\r')) {
        setChangeOnMatch(true);
        setInputValue(x.trim());
        setItemID(x.trim());
      } else {
        setChangeOnMatch(false);
        setItemID(x);
      }
    }, 500),
    [setItemID, itemID]
  );
  const changeLocation = () => {
    (async () =>
      indexDocs([
        {
          ...matchedItems[0]._source,
          storageLocation: location,
        },
      ]))().then(() => {
      reset();
      if (onChange) onChange();
    });
  };
  useEffect(() => {
    if (itemID !== '')
      (async () =>
        setMatchedItems(
          await searchByOSUIDPrefix(itemID, true, 'sectionHalf')
        ))();
  }, [itemID]);
  useEffect(() => {
    if (inputValue === '') textareaRef.current?.focus();
  }, [inputValue]);
  useEffect(() => {
    if (matchedItems.length === 1 && changeOnMatch) changeLocation();
  }, [matchedItems, changeOnMatch]);
  if (!login?._permissions?.length)
    return (
      <LogInModal>
        <Button fluid primary style={{ margin: '1rem 0' }}>
          <Icon name="key" />
          Log In to Add Item to Storage Location
        </Button>
      </LogInModal>
    );
  else if (!login?._permissions?.includes('edit_storage'))
    return (
      <Button fluid primary style={{ margin: '1rem 0' }}>
        <Icon name="key" />
        Log In with an Account with Storage Editing Permissions
      </Button>
    );

  return (
    <Input
      fluid
      iconPosition="left"
      style={{ margin: '1rem 0' }}
      value={inputValue}
      action
    >
      <Icon>
        <BsQrCodeScan
          style={{
            display: 'inline-block',
            left: 0,
            position: 'absolute',
            top: '50%',
            width: '100%',
            marginTop: '-0.5em',
          }}
        />
      </Icon>
      <textarea
        rows={1}
        ref={textareaRef}
        style={{ resize: 'none' }}
        placeholder="Add Item to Location ..."
        value={inputValue}
        onChange={(element) => {
          setInputValue(element.target.value);
          debounce(element.target.value);
        }}
      />
      <Button
        primary
        disabled={matchedItems.length != 1}
        onClick={changeLocation}
      >
        <Icon name={(matchedItems.length == 1 && 'check') || 'close'} />
        {(matchedItems.length == 0 && 'No Match') ||
          (matchedItems.length > 1 && 'Multiple Matches') ||
          'Add Item'}
      </Button>
      <Button
        basic={matchedItems.length == 1}
        icon="close"
        disabled={matchedItems.length != 1}
        onClick={reset}
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
  // if (hideEmpty && count === 0) return <></>;
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
  const [history, setHistory] = useRecoilState(historyState);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const [itemsChanged, setItemsChanged] = useState(false);

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
        if (isMounted()) {
          setItemsCount(update);
          setItemsChanged(false);
        }
      })();
  }, [isMounted, search, itemsChanged]);

  // Slots can only be viewed as a list of items
  const view = search.view !== 'items' && slot ? 'items' : search.view;

  let previousRack,
    nextRack,
    previousPosition,
    nextPosition,
    previousSlot,
    nextSlot;
  if (location && rack && position && slot) {
    const slotIndex = locationSlotNames[location][rack][position].indexOf(slot);
    if (slotIndex > 0)
      previousSlot = locationSlotNames[location][rack][position][slotIndex - 1];
    if (slotIndex < locationSlotNames[location][rack][position].length - 1)
      nextSlot = locationSlotNames[location][rack][position][slotIndex + 1];
  } else if (location && rack && position) {
    const positionIndex =
      locationPositionNames[location][rack].indexOf(position);
    if (positionIndex > 0)
      previousPosition =
        locationPositionNames[location][rack][positionIndex - 1];
    if (positionIndex < locationPositionNames[location][rack].length - 1)
      nextPosition = locationPositionNames[location][rack][positionIndex + 1];
  } else if (location && rack) {
    const rackIndex = locationRackNames[location].indexOf(rack);
    if (rackIndex > 0)
      previousRack = locationRackNames[location][rackIndex - 1];
    if (rackIndex < locationRackNames[location].length - 1)
      nextRack = locationRackNames[location][rackIndex + 1];
  }

  return (
    <>
      <LocationsSearchBar plural="Items" />
      <ButtonGroup fluid size="mini">
        <Button primary disabled>
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
          <Button.Content>List</Button.Content>
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
      {rack && !position && (
        <ButtonGroup fluid size="mini">
          <Button
            size="mini"
            style={{
              marginTop: '1em',
            }}
            disabled={!previousRack}
            onClick={() =>
              setHistory({
                ...history,
                locations: [
                  ...history.locations.slice(0, history.index),
                  { path: previousRack },
                ],
              })
            }
          >
            <Icon name="arrow left" />
            {previousRack || 'Previous'}
          </Button>
          <Button
            size="mini"
            style={{
              marginTop: '1em',
            }}
            disabled={!nextRack}
            onClick={() =>
              setHistory({
                ...history,
                locations: [
                  ...history.locations.slice(0, history.index),
                  { path: nextRack },
                ],
              })
            }
          >
            {nextRack || 'Next'}
            <Icon name="arrow right" />
          </Button>
        </ButtonGroup>
      )}
      {position && !slot && (
        <ButtonGroup fluid size="mini">
          <Button
            size="mini"
            style={{
              marginTop: '1em',
            }}
            disabled={!previousPosition}
            onClick={() =>
              setHistory({
                ...history,
                locations: [
                  ...history.locations.slice(0, history.index),
                  { path: previousPosition },
                ],
              })
            }
          >
            <Icon name="arrow left" />
            {previousPosition || 'Previous'}
          </Button>
          <Button
            size="mini"
            style={{
              marginTop: '1em',
            }}
            disabled={!nextPosition}
            onClick={() =>
              setHistory({
                ...history,
                locations: [
                  ...history.locations.slice(0, history.index),
                  { path: nextPosition },
                ],
              })
            }
          >
            {nextPosition || 'Next'}
            <Icon name="arrow right" />
          </Button>
        </ButtonGroup>
      )}
      {slot && (
        <ButtonGroup fluid size="mini">
          <Button
            size="mini"
            style={{
              marginTop: '1em',
            }}
            disabled={!previousSlot}
            onClick={() =>
              setHistory({
                ...history,
                locations: [
                  ...history.locations.slice(0, history.index),
                  { path: previousSlot },
                ],
              })
            }
          >
            <Icon name="arrow left" />
            {previousSlot || 'Previous'}
          </Button>
          <Button
            size="mini"
            style={{
              marginTop: '1em',
            }}
            disabled={!nextSlot}
            onClick={() =>
              setHistory({
                ...history,
                locations: [
                  ...history.locations.slice(0, history.index),
                  { path: nextSlot },
                ],
              })
            }
          >
            {nextSlot || 'Next'}
            <Icon name="arrow right" />
          </Button>
        </ButtonGroup>
      )}
      <List relaxed divided style={{ marginTop: '0.5em' }}>
        <List.Item></List.Item>
        {view == 'locations' &&
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
        {view == 'locations' &&
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
        {(view == 'locations' && location && rack && position && !slot && (
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
      {view == 'map' && !location && <LocationsMap />}
      {view == 'map' && location && !rack && <LocationsZone zone={location} />}
      {view == 'map' && location && rack && !position && (
        <LocationsRack zone={location} rack={rack} />
      )}
      {view == 'map' && location && rack && position && !slot && (
        <LocationsPosition zone={location} rack={rack} position={position} />
      )}
      {(location && rack && position && slot && (
        <>
          <LocationsAddItem
            location={`${location}-${rack}-${position}-${slot}`}
            onChange={() => setItemsChanged(true)}
          />
          <LocationsRowsBlock
            key={`${location}_${rack}_${position}_${slot}`}
            minRowHeight={50}
            from={0}
            size={10000}
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
        </>
      )) ||
        (view == 'items' && (
          <PageScroll
            pageSize={10}
            rows={[...Array(Math.ceil((itemsCount || 0) / 10)).keys()].map(
              (i) => (
                <LocationsRowsBlock
                  key={`${location}_${rack}_${position}_${slot}_${i}`}
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
              )
            )}
          />
        ))}
    </>
  );
};

export default LocationsPage;
