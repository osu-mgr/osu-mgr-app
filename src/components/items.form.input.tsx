import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { Form, FormInputProps } from 'semantic-ui-react';
import { loginState } from '../stores/items';

const ItemsFormInput: FunctionComponent<FormInputProps> = (
  props: FormInputProps
) => {
  const login = useRecoilValue(loginState);
  return (
    <Form.Input
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      readOnly={!login || !login._permissions?.includes('edit_items')}
    />
  );
};

export default ItemsFormInput;
