import React, { useEffect, FC } from 'react';
import logo from './logo.svg';
import './App.scss';
import './styles/index.scss';
import 'materialize-css/dist/css/materialize.min.css';

import { inject, observer } from 'mobx-react';
import Store from './store';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PageRoute from './components/PageRoute';
import Home from './pages/home';
import { Login, Signup } from './pages/authentication';

interface IProps {
  store?: Store
}

const App: FC<IProps> = (props) => {
  useEffect(() => {
    const { store } = props;
    console.log(store);
  });
  return (
    <div className="App">
      <Router>
        <Switch>  {/* Actually the only thing done here is defining the layout and the protection of the route */}
          <PageRoute path="/" exact Component={Home} ></PageRoute>
          <PageRoute path="/sign-in" exact Component={Login} pageConfiguration={{ layout: false, auth: false }}></PageRoute>
          <PageRoute path="/sign-up" exact Component={Signup} pageConfiguration={{ layout: false, auth: false }}></PageRoute>
        </Switch>
      </Router>
    </div>
  );
};


export default inject('store')(observer(App));