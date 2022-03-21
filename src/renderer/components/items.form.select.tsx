/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { FunctionComponent, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Form, FormSelectProps } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import { searchByType, itemByUUID } from '../common/es';
import { loginState } from '../stores/accounts';
import { ItemType, Item } from '../stores/items';

interface ItemsFormSelectProps extends FormSelectProps {
  // eslint-disable-next-line react/require-default-props
  type?: ItemType;
}

const ItemsFormSelect: FunctionComponent<ItemsFormSelectProps> = (
  props: ItemsFormSelectProps
) => {
  const isMounted = useMountedState();
  const login = useRecoilValue(loginState);
  const [items, setItems] = useState<Item[] | undefined>(undefined);
  useEffect(() => {
    setItems(undefined);
    if (props.type && props.value) {
      (async () => {
        const uuid: string = String(props.value) || '';
        const update = [await itemByUUID(uuid)];
        if (isMounted()) setItems(update as unknown as Item[]);
      })();
    } else if (props.type) {
      (async () => {
        const update = (await searchByType(props.type || '')).map(
          (x) => x._source
        );
        if (isMounted()) setItems(update as unknown as Item[]);
      })();
    }
  }, [isMounted, props.value, props.type]);
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
