import React, { FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import SwipeableViews from 'react-swipeable-views';
import { Dimmer } from 'semantic-ui-react';
import { historyState } from '../stores/history';
import ErrorPage from './error.page';
import HomePage from './home.page';
import ItemsPage from './items.page';
import ItemsCruisesProgramsPage from './items.cruises-programs.page';
import ItemsCoresPage from './items.cores.page';
import ItemsSectionsPage from './items.sections.page';
import ItemsSectionHalvesPage from './items.section-halves.page';
import ItemsSectionSamplesPage from './items.section-samples.page';
import ItemsDivesPage from './items.dives.page';
import ItemsDiveSamplesPage from './items.dive-samples.page';
import ItemsDiveSubsamplesPage from './items.dive-subsamples.page';
import StoragePage from './storage.page';
import SampleRequestsPage from './sample-requests.page';

const Router: FunctionComponent<{ path: string }> = ({ path }) => {
  switch (path) {
    case 'Home':
      return <HomePage />;
    case 'Items':
      return <ItemsPage />;
    case 'Cruises/Programs':
      return <ItemsCruisesProgramsPage />;
    case 'Cores':
      return <ItemsCoresPage />;
    case 'Sections':
      return <ItemsSectionsPage />;
    case 'Section Halves':
      return <ItemsSectionHalvesPage />;
    case 'Section Samples':
      return <ItemsSectionSamplesPage />;
    case 'Dives':
      return <ItemsDivesPage />;
    case 'Dive Samples':
      return <ItemsDiveSamplesPage />;
    case 'Dive Subsamples':
      return <ItemsDiveSubsamplesPage />;
    case 'Storage':
      return <StoragePage />;
    case 'Sample Requests':
      return <SampleRequestsPage />;
    default:
      return <ErrorPage />;
  }
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
