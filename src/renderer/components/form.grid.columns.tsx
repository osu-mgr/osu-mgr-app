import React, { FunctionComponent } from 'react';
import { Form, Grid, StrictGridColumnProps } from 'semantic-ui-react';

const FormGridColumns: FunctionComponent<{
  widths: StrictGridColumnProps['width'][];
  children?: React.ReactChild[];
  label?: string;
}> = ({ children, widths, label }) => {
  return (
    <>
      {label !== undefined && (
        <Form.Field label={label} style={{ marginBottom: 0 }} />
      )}
      <Form.Field>
        <Grid verticalAlign="bottom" style={{ marginTop: 0, marginBottom: 0 }}>
          {children &&
            children.map((_, i) => (
              <Grid.Column
                key={i}
                width={widths[i]}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              >
                {children[i]}
              </Grid.Column>
            ))}
        </Grid>
      </Form.Field>
    </>
  );
};

export default FormGridColumns;
