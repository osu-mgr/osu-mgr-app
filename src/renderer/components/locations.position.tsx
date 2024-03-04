import _ from 'lodash';
import { useState, FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import LocationsCount from './locations.count';
import { historyState } from '../stores/history';
import {
  locationPositionSlots,
  locationPrefixesName,
} from '../common/storageLocations';
import styles from './locations.map.module.css';

const LocationsMapSlot: FunctionComponent<{
  zone: string;
  rack: string;
  position: string;
  slot: string;
}> = ({ zone, rack, position, slot }) => {
  const [history, setHistory] = useRecoilState(historyState);
  const [count, setCount] = useState<number | undefined>(undefined);
  return (
    <a
      href="#"
      onClick={() => {
        if (history.switching) return;
        if (slot !== history.locations[history.index].path)
          setHistory({
            ...history,
            index: history.index + 1,
            locations: [
              ...history.locations.slice(0, history.index + 1),
              { path: slot },
            ],
          });
      }}
    >
      <div
        className={
          count === 0 || count === undefined ? styles.slotEmpty : styles.slot
        }
      >
        <div className={styles.slotCount}>
          <LocationsCount
            location={zone}
            rack={rack}
            position={position}
            slot={slot}
            onCount={(x) => setCount(x)}
          />
        </div>
      </div>
    </a>
  );
};

const LocationsPosition: FunctionComponent<{
  zone: string;
  rack: string;
  position: string;
}> = ({ zone, rack, position }) => {
  const slots = locationPositionSlots[zone][rack][position];
  return (
    <div style={{ textAlign: 'center' }}>
      <span className={styles.zoneTitle}>
        {locationPrefixesName[zone]} ({zone}) Rack {rack} {position}
      </span>
      <div className={styles.rackPage}>
        <table style={{ borderSpacing: 0 }}>
          <tbody>
            <tr>
              <td> </td>
              {[...Array(slots.h?.length).keys()].map((j) => (
                <td key={slots.h[j]}>
                  <span className={styles.rackLabel}>{slots.h[j]}</span>
                </td>
              ))}
            </tr>
            {[...Array(slots.v?.length).keys()].map((i) => (
              <tr key={slots.v[i]}>
                <td style={{ paddingRight: '.5em' }}>
                  <span className={styles.rackLabel}>{slots.v[i]}</span>
                </td>
                {[...Array(slots.h?.length).keys()].map((j) => (
                  <td key={slots.h[j]}>
                    <LocationsMapSlot
                      zone={zone}
                      rack={rack}
                      position={position}
                      slot={`${slots.h[j]}${slots.v[i]}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationsPosition;
