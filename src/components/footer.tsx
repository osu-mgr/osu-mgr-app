import React, { FunctionComponent } from 'react';
import { List, Divider } from 'semantic-ui-react';
import cp from 'child_process';

const pjson = require('../../package.json');

const Footer: FunctionComponent = () => {
  return (
    <>
      <List
        horizontal
        style={{
          position: 'fixed',
          left: '.5rem',
          bottom: 0,
          width: 'calc(100vw - 1rem)',
          padding: 0,
          margin: 0,
        }}
      >
        <List.Item
          as="a"
          onClick={(): void => {
            cp.execSync('start http://osu-mgr.org');
          }}
        >
          OSU-MGR
        </List.Item>
        <List.Item style={{ marginLeft: '.5rem' }}>
          App v. {pjson.version}
        </List.Item>
      </List>
      <Divider
        fitted
        style={{
          position: 'fixed',
          left: '.5rem',
          top: 'calc(100vh - 2rem)',
          width: 'calc(100vw - 1rem)',
        }}
      />
    </>
  );
};

export default Footer;
