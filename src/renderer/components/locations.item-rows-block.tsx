import React, { FunctionComponent, useState, useEffect } from 'react';
import { useInView } from 'react-hook-inview';
import { useRecoilValue } from 'recoil';
import { Divider, List, Loader } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import { locationsSearchState } from '../stores/locations';
import { searchByLocation, Hit } from '../common/es';

const LocationsRowsBlock: FunctionComponent<{
  location?: string;
  rack?: string;
  position?: string;
  slot?: string;
  minRowHeight: number;
  from: number;
  size: number;
  itemRow: (Item) => React.ReactElement;
}> = ({
  location,
  rack,
  position,
  slot,
  minRowHeight,
  from,
  size,
  itemRow,
}) => {
  const isMounted = useMountedState();
  const search = useRecoilValue(locationsSearchState);
  const [items, setItems] = useState<Hit[] | undefined>(undefined);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    setItems(undefined);
  }, [isVisible, search]);
  useEffect(() => {
    if (items === undefined && isVisible && isMounted())
      (async () => {
        const matchedItems = await searchByLocation(
          location,
          rack,
          position,
          slot,
          search,
          from,
          size
        );
        if (isMounted()) setItems(matchedItems);
      })();
  }, [isMounted, isVisible, items, search, from, size]);
  console.log('LocationsRowsBlock', {
    location,
    rack,
    position,
    slot,
    from,
    size,
    isMounted,
    isVisible,
    items,
    search,
  });
  return (
    <div
      ref={ref}
      style={{
        minHeight:
          items?.length !== undefined
            ? minRowHeight * Math.min(items?.length || 0, size)
            : minRowHeight * size,
      }}
    >
      {isVisible && items === undefined && (
        <div style={{ textAlign: 'center' }}>
          <Divider fitted />
          <Loader inline active style={{ marginTop: minRowHeight }} />
        </div>
      )}
      {isVisible && (items?.length || 0) > 0 && (
        <List relaxed divided>
          <div />
          {items?.map((item) => {
            if (item) return itemRow(item);
            return undefined;
          })}
          <div />
        </List>
      )}
    </div>
  );
};

export default LocationsRowsBlock;
