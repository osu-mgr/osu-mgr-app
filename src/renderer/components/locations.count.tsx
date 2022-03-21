import numeral from 'numeral';
import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useInView } from 'react-hook-inview';
import { Loader } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import { ItemsSearch, itemsSearchState } from '../stores/items';
import { countByLocation } from '../common/es';

const LocationsCount: FunctionComponent<{
  location?: string;
  rack?: string;
  position?: string;
  slot?: string;
  label?: string;
  singular?: string;
  plural?: string;
  filter?: 'recent' | 'valid' | 'warning' | 'error';
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
  onCount,
}) => {
  const isMounted = useMountedState();
  const search = useRecoilValue(itemsSearchState);
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    // if (timestamp !== undefined && Date.now() - timestamp < 30000) return;
    // setTimestamp(Date.now());
    setItemsCount(undefined);
    if (isMounted())
      (async () => {
        const update = await countByLocation(
          location,
          rack,
          position,
          slot,
          filter ? ({ ...search, filter: undefined } as ItemsSearch) : search,
          filter
        );
        if (onCount) onCount(update);
        if (isMounted()) setItemsCount(update);
      })();
  }, [
    isMounted,
    isVisible,
    // timestamp,
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
          <Loader active inline className="inline-loader" /> {plural || label}
        </>
      ) : (
        <>{`${numeral(itemsCount).format('0,0')} ${
          itemsCount === 1 ? singular || label : plural || label
        }`}</>
      )}
    </>
  );
};

export default LocationsCount;
