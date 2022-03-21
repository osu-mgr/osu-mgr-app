import { FunctionComponent } from 'react';
import { Grid, Icon, StrictIconProps, SemanticWIDTHS } from 'semantic-ui-react';

const GridIconRow: FunctionComponent<{
  icon: StrictIconProps['name'];
  iconWidth?: number;
}> = ({ children, icon, iconWidth = 1 }) => {
  let width = Math.round(iconWidth);
  width = iconWidth > 15 ? 15 : width;
  width = iconWidth < 1 ? 1 : width;
  return (
    <Grid.Row>
      <Grid.Column width={width as SemanticWIDTHS} textAlign="right">
        <Icon name={icon} />
      </Grid.Column>
      <Grid.Column width={(16 - width) as SemanticWIDTHS} textAlign="left">
        {children}
      </Grid.Column>
    </Grid.Row>
  );
};

export default GridIconRow;
