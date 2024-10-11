import _ from 'lodash';
import { useState, useEffect, FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import LocationsCount from './locations.count';
import LocationsCapacity from './locations.capacity';
import { historyState } from '../stores/history';
import { weightByLocation } from '../common/es';
import {
  locationRacks,
  locationPositionConfigurations,
  locationPrefixesName,
} from '../common/storageLocations';
import styles from './locations.map.module.css';

const LocationsMapPosition: FunctionComponent<{
  name: string;
  zone: string;
  rack: string;
  position: string;
}> = ({ name, zone, rack, position }) => {
  const [history, setHistory] = useRecoilState(historyState);
  const [count, setCount] = useState<number | undefined>(undefined);
  return (
    <a
      href="#"
      onClick={() => {
        if (history.switching) return;
        if (position !== history.locations[history.index].path)
          setHistory({
            ...history,
            index: history.index + 1,
            locations: [
              ...history.locations.slice(0, history.index + 1),
              { path: position },
            ],
          });
      }}
    >
      <div
        className={
          count === 0 || count === undefined
            ? styles.positionEmpty
            : styles.position
        }
      >
        <div className={styles.positionCount}>
          <div className={styles.positionLabel}>{name}</div>
          <LocationsCount
            location={zone}
            rack={rack}
            position={position}
            onCount={(x) => setCount(x)}
          />
          <LocationsCapacity zone={zone} rack={rack} position={position} />
        </div>
      </div>
    </a>
  );
};

const LocationsMapBoxes: FunctionComponent<{
  name: string;
  zone: string;
  rack: string;
  shelf: string;
}> = ({ zone, rack, shelf }) => {
  const [history, setHistory] = useRecoilState(historyState);
  const [count, setCount] = useState<number | undefined>(undefined);
  return (
    <a
      href="#"
      onClick={() => {
        if (history.switching) return;
        if (shelf !== history.locations[history.index].path)
          setHistory({
            ...history,
            index: history.index + 1,
            locations: [
              ...history.locations.slice(0, history.index + 1),
              { path: shelf },
            ],
          });
      }}
    >
      <div
        className={
          count === 0 || count === undefined ? styles.boxesEmpty : styles.boxes
        }
      >
        <div className={styles.boxesCount}>
          <LocationsCount
            location={zone}
            rack={rack}
            position={shelf}
            onCount={(x) => setCount(x)}
          />
          <LocationsCapacity zone={zone} rack={rack} position={shelf} />
        </div>
      </div>
    </a>
  );
};

// const shelfWeightCache = new Map<string, {}>();

const ShelfWeight: FunctionComponent<{
  zone: string;
  rack: string;
  positions: string[];
  maxPounds: number;
}> = ({ zone, rack, positions, maxPounds }) => {
  const [weight, setWeight] = useState<{ string: number } | {}>({});
  if (!positions) console.log('no positions', zone, rack);
  useEffect(() => {
    setWeight({});
    positions?.forEach(async (position) => {
      const positionWeight = await weightByLocation(
        zone,
        rack,
        position,
        undefined
      );
      weight[position] = positionWeight;
      setWeight((prevWeight) => ({
        ...prevWeight,
        [position]: positionWeight,
      }));
    });
  }, [zone, rack, positions, maxPounds]);
  const totalWeight = _.values(weight)
    .reduce((acc, x) => acc + x, 0)
    .toFixed(0);
  return (
    <>
      {_.keys(weight).length !== positions?.length ? '?' : totalWeight} of
      <br />
      {maxPounds} lbs
    </>
  );
};

const LocationsRack: FunctionComponent<{
  zone: string;
  rack: string;
}> = ({ zone, rack }) => {
  const shelves =
    locationPositionConfigurations[locationRacks[zone][rack]?.type];
  const border = '.5rem solid rgb(89, 89, 89, 0.5)';
  return (
    <div style={{ textAlign: 'center' }}>
      <span className={styles.zoneTitle}>
        {locationPrefixesName[zone]} ({zone}) Rack {rack}
      </span>
      <div className={styles.rackPage}>
        <table style={{ borderSpacing: 0 }}>
          <tbody>
            {shelves.map((shelf) => (
              <tr key={shelf.name}>
                <td style={{ borderRight: border, paddingRight: '1em' }}>
                  {(shelf.name === '' && (
                    <div
                      className={styles.rackLabel}
                      style={{ height: '1em' }}
                    ></div>
                  )) || (
                    <div className={styles.rackLabel}>Shelf {shelf.name}</div>
                  )}
                </td>
                {shelf.positions?.map((position) => (
                  <td
                    key={position.name}
                    style={{
                      padding: '.3em',
                      borderBottom: shelf.noShelf ? '' : border,
                    }}
                  >
                    {position.name && (
                      <LocationsMapPosition
                        name={position.name}
                        zone={zone}
                        rack={rack}
                        position={position.name}
                      />
                    )}
                  </td>
                ))}
                {shelf.boxes && (
                  <td
                    style={{
                      padding: '.3em',
                      borderBottom: shelf.noShelf ? '' : border,
                    }}
                  >
                    <LocationsMapBoxes
                      name={shelf.name}
                      zone={zone}
                      rack={rack}
                      shelf={shelf.name}
                    />
                  </td>
                )}
                {shelf.name === '' && <td></td>}
                <td style={{ borderLeft: border, paddingLeft: '1em' }}>
                  <div className={styles.rackLabel}>
                    {shelf.maxPounds && (
                      <ShelfWeight
                        zone={zone}
                        rack={rack}
                        positions={shelf.positions?.map((x) => x.name)}
                        maxPounds={shelf.maxPounds}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationsRack;
