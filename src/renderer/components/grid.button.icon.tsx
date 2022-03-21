import { FunctionComponent } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';

const GridButtonIcon: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <Button
      primary
      fluid
      style={{ marginBottom: 2, paddingLeft: 0, paddingRight: 0 }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default GridButtonIcon;
