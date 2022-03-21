import { FunctionComponent } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import SwipeableViews from 'react-swipeable-views';
import { Dimmer } from 'semantic-ui-react';
import { historyState } from '../stores/history';
import ErrorPage from './error.page';
import HomePage from './home.page';
import ItemsPage from './items.page';
import ItemsTypePage from './items.type.page';
import LocationsPage from './locations.page';
import { ItemType, itemTypesPlural } from '../stores/items';

const itemPluralsType = Object.fromEntries(
  Object.entries(itemTypesPlural).map(([k, v]) => [v, k])
);

const Router: FunctionComponent<{ path: string }> = ({ path }) => {
  const history = useRecoilValue(historyState);
  if (path === 'Home') return <HomePage />;
  if (path === 'Items') return <ItemsPage />;
  if (itemPluralsType[path])
    return <ItemsTypePage type={itemPluralsType[path] as ItemType} />;
  if (path === 'Storage Locations') return <LocationsPage />;
  if (
    history.locations.length > 1 &&
    history.locations[1].path === 'Storage Locations'
  )
    return (
      <LocationsPage
        location={
          (history.locations.length > 2 && history.locations[2].path) ||
          undefined
        }
        rack={
          (history.locations.length > 3 && history.locations[3].path) ||
          undefined
        }
        position={
          (history.locations.length > 4 && history.locations[4].path) ||
          undefined
        }
        slot={
          (history.locations.length > 5 && history.locations[5].path) ||
          undefined
        }
      />
    );
  return <ErrorPage />;
};

const Main: FunctionComponent = () => {
  const [history, setHistory] = useRecoilState(historyState);
  return (
    <SwipeableViews
      enableMouseEvents
      index={history.index}
      onChangeIndex={(index) => setHistory({ ...history, index })}
      onSwitching={() => setHistory({ ...history, switching: true })}
      onTransitionEnd={() => setHistory({ ...history, switching: false })}
      style={{
        marginTop: '2.5rem',
      }}
    >
      {history.locations.map((location, index) => (
        <div
          key={index}
          style={{
            height: 'calc(100vh - 4.5rem)',
            width: '100vw',
            padding: '0 .5rem',
            overflowY: 'scroll',
          }}
        >
          <Dimmer.Dimmable dimmed={index !== history.index}>
            <Router path={location.path} />
            <Dimmer inverted active={index !== history.index} />
          </Dimmer.Dimmable>
        </div>
      ))}
    </SwipeableViews>
  );
};

export default Main;
