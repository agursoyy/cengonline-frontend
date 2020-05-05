import React, { useEffect, FC } from 'react';
import logo from './logo.svg';
import './App.css';
import { inject, observer } from 'mobx-react';
import Store from './store';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "materialize-css/dist/css/materialize.min.css";



interface IProps {
  store?: Store
};

const App: FC<IProps> = (props) => {
  useEffect(() => {
    const { store } = props;
    console.log(store);
  });
  return (
    <div className="App">
      <Router>
        <div>Navbar</div>
        <Switch>

        </Switch>
      </Router>
    </div>
  );
};


export default inject('store')(observer(App));