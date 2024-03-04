import numeral from 'numeral';
import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useInView } from 'react-hook-inview';
import { Loader } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import { historyState } from '../stores/history';
import { ItemsSearch, itemsSearchState } from '../stores/items';
import { countByLocation } from '../common/es';

const locationsCountCache = new Map<string, number>();

const LocationsCount: FunctionComponent<{
  location?: string;
  rack?: string;
  position?: string;
  slot?: string;
  label?: string;
  singular?: string;
  plural?: string;
  filter?: 'recent' | 'valid' | 'warning' | 'error';
  inverted?: boolean;
  onCount?: (count: number) => void;
}> = ({
  location,
  rack,
  position,
  slot,
  label,
  singular,
  plural,
  filter,
  inverted,
  onCount,
}) => {
  const history = useRecoilValue(historyState);
  const isMounted = useMountedState();
  const search = useRecoilValue(itemsSearchState);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    const key = `${location || ''}:${rack || ''}:${position || ''}:${
      slot || ''
    }:${JSON.stringify(search)}:${filter || ''}`;
    if (locationsCountCache.has(key)) {
      setItemsCount(locationsCountCache.get(key));
      if (isMounted() && !history.switching && onCount)
        onCount(locationsCountCache.get(key) || 0);
    } else {
      setItemsCount(undefined);
    }
    if (isMounted() && !history.switching)
      (async () => {
        const updatedCount = await countByLocation(
          location,
          rack,
          position,
          slot,
          filter ? ({ ...search, filter: undefined } as ItemsSearch) : search,
          filter
        );
        locationsCountCache.set(key, updatedCount);
        if (onCount) onCount(updatedCount);
        if (isMounted() && !history.switching) setItemsCount(updatedCount);
      })();
  }, [
    history,
    isVisible,
    filter,
    search,
    location,
    rack,
    position,
    slot,
    onCount,
  ]);
  return (
    <>
      <span ref={ref} />
      {itemsCount === undefined ? (
        <>
          <Loader active inline className="inline-loader" inverted={inverted} />{' '}
          {plural || label}
        </>
      ) : (
        <>{`${numeral(itemsCount).format('0,0')} ${
          itemsCount === 1 ? singular || label || '' : plural || label || ''
        }`}</>
      )}
    </>
  );
};

export default LocationsCount;
