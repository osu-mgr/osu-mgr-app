import React from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import App from './app';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);
