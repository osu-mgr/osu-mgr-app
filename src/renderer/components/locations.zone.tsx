import _ from 'lodash';
import { useState, FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import LocationsCount from './locations.count';
import LocationsCapacity from './locations.capacity';
import { historyState } from '../stores/history';
import styles from './locations.map.module.css';
import {
  locationRackConfigurations,
  locationPrefixesName,
} from '../common/storageLocations';

const LocationsMapRack: FunctionComponent<{
  zone: string;
  rack: string;
}> = ({ zone, rack }) => {
  const [history, setHistory] = useRecoilState(historyState);
  const [count, setCount] = useState<number | undefined>(undefined);
  return (
    <a
      href="#"
      onClick={() => {
        if (history.switching) return;
        if (rack !== history.locations[history.index].path)
          setHistory({
            ...history,
            index: history.index + 1,
            locations: [
              ...history.locations.slice(0, history.index + 1),
              { path: rack },
            ],
          });
      }}
    >
      <div
        className={
          count === 0 || count === undefined ? styles.rackEmpty : styles.rack
        }
      >
        <div className={styles.rackCount}>
          <LocationsCount
            location={zone}
            rack={rack}
            onCount={(x) => setCount(x)}
          />
        </div>
        <LocationsCapacity zone={zone} rack={rack} />
      </div>
    </a>
  );
};

const LocationsZone: FunctionComponent<{
  zone: string;
}> = ({ zone }) => (
  <div style={{ textAlign: 'center' }}>
    <span className={styles.zoneTitle}>
      {locationPrefixesName[zone]} ({zone})
    </span>
    <div className={styles.zonePage}>
      <table>
        <tbody>
          {locationRackConfigurations[zone].map((row) => (
            <tr key={row.name}>
              {zone.slice(-1) === 'E' && (
                <td>
                  <span className={styles.rackLabel}>
                    {row.racks && row.name}
                  </span>
                </td>
              )}
              {row.racks?.map((rack) => (
                <td key={rack.name}>
                  {rack.name && (
                    <LocationsMapRack zone={zone} rack={rack.name} />
                  )}
                </td>
              ))}
              {row.labels?.map((label) => (
                <td key={label}>
                  <span className={styles.rackLabel}>{label}</span>
                </td>
              ))}
              {zone.slice(-1) === 'W' && (
                <td>
                  <span className={styles.rackLabel}>
                    {row.racks && row.name}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LocationsZone;
