import React, { useEffect, FC } from 'react';
import logo from './logo.svg';
import './App.scss';
import './styles/index.scss';
import 'materialize-css/dist/css/materialize.min.css';

import { inject, observer } from 'mobx-react';
import Store from './store';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PageRoute from './components/PageRoute';
import { Login, Signup } from './pages/authentication';

interface IProps {
  store?: Store
}

const App: FC<IProps> = (props) => {
  useEffect(() => {
    const { store } = props;
    console.log(store);
    console.log('ALPTEKİN');
  });
  return (
    <div className="App">
      <Router>
        {/* 
        <div className="title">Navbar</div>
        <a className="waves-effect waves-light btn">button</a>
       */}
        <Switch>
          <PageRoute path="/sign-in" Component={Login} pageConfiguration={{ layout: false }}></PageRoute>
          <PageRoute path="/sign-up" Component={Signup}></PageRoute>
        </Switch>
      </Router>
    </div>
  );
};


export default inject('store')(observer(App));