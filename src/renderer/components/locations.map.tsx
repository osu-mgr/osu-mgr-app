import _ from 'lodash';
import { FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import LocationsCount from './locations.count';
import { historyState } from '../stores/history';
import styles from './locations.map.module.css';

const LocationsMapZone: FunctionComponent<{
  zone: string;
  style?: React.CSSProperties;
}> = ({ zone, style }) => {
  const [history, setHistory] = useRecoilState(historyState);
  return (
    <a
      href="#"
      onClick={() => {
        if (history.switching) return;
        if (zone !== history.locations[history.index].path)
          setHistory({
            ...history,
            index: history.index + 1,
            locations: [
              ...history.locations.slice(0, history.index + 1),
              { path: zone },
            ],
          });
      }}
    >
      <div className={styles.zone} style={style}>
        <LocationsCount location={zone} />
      </div>
    </a>
  );
};

const LocationsMap: FunctionComponent = () => {
  const border = '.25em solid rgb(89, 89, 89)';
  return (
    <table className={styles.map} style={{ border }}>
      <tbody>
        <tr style={{ height: '8.25%' }}>
          <td
            style={{
              width: '30%',
              textAlign: 'center',
              padding: '.2em',
            }}
            rowSpan={3}
          >
            <span className={styles.zoneLabel}>DRY WEST (DW)</span>
            <LocationsMapZone zone="DW" />
          </td>
          <td style={{ width: '4%' }} rowSpan={3} />
          <td
            style={{
              width: '42%',
              verticalAlign: 'top',
              textAlign: 'right',
              paddingTop: '.5em',
            }}
            colSpan={5}
          >
            <span
              style={{ marginRight: '-1.5em' }}
              className={styles.zoneLabel}
            >
              ROCK BASEMENT (RB)
            </span>
          </td>
          <td
            style={{
              width: '24%',
              textAlign: 'center',
              padding: '1% 5% 0',
            }}
            colSpan={2}
            rowSpan={2}
          >
            <LocationsMapZone zone="RB" style={{ height: '100%' }} />
          </td>
        </tr>
        <tr style={{ height: '14.75%' }}>
          <td
            style={{ textAlign: 'center', padding: '.2em' }}
            rowSpan={2}
            colSpan={4}
          >
            <span className={styles.zoneLabel}>DRY EAST (DE)</span>
            <LocationsMapZone zone="DE" />
          </td>
          <td style={{ border }} rowSpan={4} />
        </tr>
        <tr style={{ height: '7%' }}>
          <td style={{ width: '3%' }} rowSpan={3} />
          <td
            style={{
              width: '21%',
              textAlign: 'center',
              padding: '.2em',
            }}
            rowSpan={2}
          >
            <span className={styles.zoneLabel}>ROCK EAST (RE)</span>
            <LocationsMapZone
              zone="RE"
              style={{ height: 'calc(100% - 4em)' }}
            />
          </td>
        </tr>
        <tr style={{ height: '55%' }}>
          <td
            style={{
              textAlign: 'center',
              padding: '.2em',
              borderTop: border,
            }}
            rowSpan={3}
          >
            <span className={styles.zoneLabel}>COLD WEST (CW)</span>
            <LocationsMapZone zone="CW" />
          </td>
          <td />
          <td
            style={{
              textAlign: 'center',
              padding: '.2em',
              borderTop: border,
            }}
            colSpan={4}
          >
            <span className={styles.zoneLabel}>COLD EAST (CE)</span>
            <LocationsMapZone zone="CE" />
          </td>
        </tr>
        <tr style={{ height: '2%' }}>
          <td style={{ width: '26%' }} colSpan={2} />
          <td style={{ width: '2%' }} />
          <td style={{ width: '4%' }} />
          <td style={{ width: '2%' }} />
          <td />
        </tr>
        <tr style={{ height: '5%' }}>
          <td
            style={{
              width: '26%',
              textAlign: 'center',
              verticalAlign: 'bottom',
              borderLeft: border,
              borderTop: border,
            }}
            colSpan={2}
          >
            <span className={styles.zoneLabel}>SEDIMENT FREEZER (SF)</span>
          </td>
          <td style={{ width: '2%', borderTop: border }} />
          <td style={{ width: '4%' }} />
          <td style={{ width: '2%', borderTop: border }} />
          <td style={{ borderTop: border }} />
          <td style={{ borderRight: border }} colSpan={2} />
        </tr>
        <tr style={{ height: '8%' }}>
          <td style={{ width: '30%', borderTop: border }} />
          <td
            style={{ width: '26%', padding: '.2em', direction: 'rtl' }}
            colSpan={2}
          >
            <LocationsMapZone
              zone="SF"
              style={{ height: '100%', right: '.2em', direction: 'ltr' }}
            />
          </td>
          <td style={{ width: '8%', borderLeft: border }} colSpan={3} />
          <td style={{ width: '36%', border }} colSpan={3} />
        </tr>
      </tbody>
    </table>
  );
};

export default LocationsMap;
