import numeral from 'numeral';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useInView } from 'react-hook-inview';
import { Loader } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import { DocType, ItemsSearch, itemsSearchState } from '../stores/items';
import { countByType } from '../es';

const ItemsCount: FunctionComponent<{
  type?: DocType;
  label?: string;
  singular?: string;
  plural?: string;
  filter?: 'recent' | 'valid' | 'warning' | 'error';
}> = ({ type, label, singular, plural, filter }) => {
  const search = useRecoilValue(itemsSearchState);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    setItemsCount(undefined);
    (async () => {
      setItemsCount(
        await countByType(
          type,
          filter ? ({ ...search, filter: undefined } as ItemsSearch) : search,
          filter
        )
      );
    })();
  }, [isVisible, filter, search, type]);
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

export default ItemsCount;
