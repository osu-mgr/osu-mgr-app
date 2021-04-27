import * as React from 'react';
import Header from './components/header';
import Main from './components/main';
import Footer from './components/footer';
import 'semantic-ui-css/semantic.min.css';
import './app.global.css';

export default function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
