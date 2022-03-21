import * as React from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import Header from './components/header';
import Main from './components/main';
import Footer from './components/footer';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

render(
  <RecoilRoot>
    <Header />
    <Main />
    <Footer />
  </RecoilRoot>,
  document.getElementById('root')
);
