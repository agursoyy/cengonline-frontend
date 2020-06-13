import React, { useEffect, FC } from 'react';
import './App.scss';
import './styles/index.scss';

import { inject, observer } from 'mobx-react';
import Store from './store';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import PageRoute from './components/PageRoute';

import Home from './pages/home';
import { Login, Signup } from './pages/authentication';
import Course from './pages/course';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    htmlFontSize: 10,
  },
});

interface IProps {
  store?: Store;
}

const App: FC<IProps> = (props) => {
  const { store } = props;
  const customHistory = store.customHistory;

  return (
    <div className="App">
      <Router history={customHistory}>
        <MuiThemeProvider theme={theme}>
          <Switch>
            {/* Actually the only thing done here is defining the layout and the protection of the route */}
            {/* auth: true olcak / için */}
            <PageRoute
              path="/"
              exact
              Component={Home}
              pageConfiguration={{ auth: true }}
            ></PageRoute>
            <PageRoute
              path="/course/:id"
              exact
              Component={Course}
              pageConfiguration={{ auth: true }}
            ></PageRoute>
            <PageRoute
              path="/sign-in"
              exact
              Component={Login}
              pageConfiguration={{ layout: false, auth: false }}
            ></PageRoute>
            <PageRoute
              path="/sign-up"
              exact
              Component={Signup}
              pageConfiguration={{ layout: false, auth: false }}
            ></PageRoute>
          </Switch>
        </MuiThemeProvider>
      </Router>
    </div>
  );
};

export default inject('store')(observer(App));
