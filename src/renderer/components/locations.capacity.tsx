import _ from 'lodash';
import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useInView } from 'react-hook-inview';
import useMountedState from '../common/useMountedState';
import { historyState } from '../stores/history';
import { storageByLocation, weightByLocation } from '../common/es';
import {
  locationRacksMaxPounds,
  locationPositionsMaxPounds,
  locationSlotNames,
} from '../common/storageLocations';
import styles from './locations.map.module.css';
import { integer } from '@opensearch-project/opensearch/api/types';

const LocationsCapacity: FunctionComponent<{
  zone: string;
  rack: string;
  position?: string;
  onCapacity?: (
    occupied: integer,
    percentageOccupied: number,
    weight: number,
    percentageWeight: number
  ) => void;
}> = ({ zone, rack, position, onCapacity }) => {
  const history = useRecoilValue(historyState);
  const isMounted = useMountedState();
  const [percentageOccupied, setPercentageOccupied] = useState<
    number | undefined
  >(undefined);
  const [percentageWeight, setPercentageWeight] = useState<number | undefined>(
    undefined
  );
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    setPercentageOccupied(undefined);
    setPercentageWeight(undefined);
    if (isMounted() && !history.switching)
      (async () => {
        const storageLocations = await storageByLocation(
          zone,
          rack,
          position,
          undefined
        );
        const nAvailable = position
          ? locationSlotNames[zone]?.[rack]?.[position]?.length || 0
          : _.keys(locationSlotNames[zone]?.[rack]).reduce(
              (acc, position) =>
                acc + (locationSlotNames[zone][rack][position].length || 0),
              0
            ) || 0;
        const percentageOccupied = nAvailable
          ? ((storageLocations?.length || 0) / nAvailable) * 100
          : 0;

        const weight = await weightByLocation(zone, rack, position, undefined);
        const maxWeight = position
          ? locationPositionsMaxPounds[zone]?.[rack]?.[position]
          : locationRacksMaxPounds[zone]?.[rack];
        const percentageWeight =
          (weight !== undefined &&
            maxWeight !== undefined &&
            maxWeight !== 0 &&
            (weight / maxWeight) * 100) ||
          0;

        if (onCapacity)
          onCapacity(nAvailable, percentageOccupied, weight, percentageWeight);
        if (isMounted() && !history.switching) {
          setPercentageOccupied(percentageOccupied);
          setPercentageWeight(percentageWeight);
        }
      })();
  }, [history, isVisible, location, rack, onCapacity]);

  return (
    <div
      ref={ref}
      className={styles.capacity}
      style={
        (percentageWeight || 0) > 1000
          ? { borderTopColor: '#9f3a38' }
          : (percentageWeight || 0) > 90
          ? { borderTopColor: '#f2711c' }
          : {}
      }
    >
      <div
        className={
          percentageOccupied === undefined
            ? styles.capacityBarLoading
            : styles.capacityBar
        }
        style={_.extend(
          {
            width: `${
              percentageOccupied === undefined ? 100 : percentageOccupied
            }%`,
          },
          (percentageWeight || 0) > 1000
            ? { backgroundColor: '#9f3a38' }
            : (percentageWeight || 0) > 90
            ? { backgroundColor: '#f2711c' }
            : {}
        )}
      ></div>
    </div>
  );
};

export default LocationsCapacity;
