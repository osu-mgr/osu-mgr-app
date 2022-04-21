import numeral from 'numeral';
import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useInView } from 'react-hook-inview';
import { Loader } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import { historyState } from '../stores/history';
import { ItemType, ItemsSearch, itemsSearchState } from '../stores/items';
import { countByType } from '../common/es';

const ItemsCount: FunctionComponent<{
  type?: ItemType;
  location?: string;
  label?: string;
  singular?: string;
  plural?: string;
  filter?: 'recent' | 'valid' | 'warning' | 'error';
  inverted?: boolean;
}> = ({ type, location, label, singular, plural, filter, inverted }) => {
  const history = useRecoilValue(historyState);
  const isMounted = useMountedState();
  const search = useRecoilValue(itemsSearchState);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    setItemsCount(undefined);
    if (isMounted() && !history.switching)
      (async () => {
        const update = await countByType(
          type,
          filter ? ({ ...search, filter: undefined } as ItemsSearch) : search,
          filter
        );
        if (isMounted() && !history.switching) setItemsCount(update);
      })();
  }, [history, isMounted, isVisible, filter, search, type, location]);
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
          itemsCount === 1 ? singular || label : plural || label
        }`}</>
      )}
    </>
  );
};

export default ItemsCount;
