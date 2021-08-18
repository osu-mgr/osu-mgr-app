/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import _ from 'lodash';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Form, FormSelectProps } from 'semantic-ui-react';
import { searchByType } from '../es';
import { Item, loginState } from '../stores/items';

interface ItemsFormSelectProps extends FormSelectProps {
  // eslint-disable-next-line react/require-default-props
  type?: string;
}

const ItemsFormSelect: FunctionComponent<ItemsFormSelectProps> = (
  props: ItemsFormSelectProps
) => {
  const login = useRecoilValue(loginState);
  const [items, setItems] = useState<Item[] | undefined>(undefined);
  useEffect(() => {
    setItems(undefined);
    if (props.type)
      (async () => {
        setItems(
          (await searchByType(props.type || '')).map(
            (x) => x._source
          ) as unknown as Item[]
        );
      })();
  }, [props.type]);
  return (
    <Form.Select
      {...props}
      fluid
      loading={!props.options.length && !items?.length}
      readOnly={!login || !login._permissions?.includes('edit_items')}
      options={
        (props.options.length && props.options) ||
        items?.map((x: Item) => {
          return {
            key: x?._uuid,
            value: x?._uuid,
            text: x?._osuid,
          };
        }) ||
        []
      }
    />
  );
};

export default ItemsFormSelect;
