import React, { FunctionComponent, useState, useEffect } from 'react';
import { useInView } from 'react-hook-inview';
import { Loader } from 'semantic-ui-react';
import { DocType, Item } from '../stores/items';
import { searchByUUIDs } from '../es';

const ItemsChildrenBlock: FunctionComponent<{
  uuid: string;
  type: DocType;
  minRowHeight: number;
  from: number;
  size: number;
  itemRow: (Item) => React.ReactElement;
}> = ({ uuid, type, minRowHeight, from, size, itemRow }) => {
  const [items, setItems] = useState<Item[] | undefined>(undefined);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    setItems(undefined);
  }, [uuid]);
  useEffect(() => {
    if (items === undefined && isVisible)
      (async () => {
        setItems(await searchByUUIDs([uuid], from, size, type));
      })();
  }, [isVisible, items, from, size, type, uuid]);
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
          <Loader inline active style={{ marginTop: minRowHeight }} />
        </div>
      )}
      {isVisible && items !== undefined && (
        <>
          {items?.map((item) => {
            if (item) return itemRow(item);
            return undefined;
          })}
          <div />
        </>
      )}
    </div>
  );
};

export default ItemsChildrenBlock;
