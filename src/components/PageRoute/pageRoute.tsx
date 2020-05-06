import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Signup, Login } from '../../pages/authentication';
const config = require('../../config');
const { publicRuntimeConfig: { pageConfig } } = config;

interface IpageConfig {
  layout?: boolean,
  auth?: boolean,
  footer?: boolean,
  header?: boolean
}

interface IProps {
  pageConfiguration?: IpageConfig,
  Component: FC,
  store?: Store,
  // All other props
  [x: string]: any;
}

const PageRoute: FC<IProps> = ({ pageConfiguration, Component, store, ...rest }) => {

  const config: IpageConfig = {
    ...pageConfig,
    ...pageConfiguration
  };
  const { layout, header, footer, auth } = config;
  const { user } = store!.user;
  const { location, path } = rest;
  let Redirected = false;
  if (location.state && location.state.from.pathname == path)
    Redirected = true;
  return (
    <Route {...rest} render={props => {

      const newComponent = layout ?
        <>
          {header && <h1>HEADER</h1>}
          <Component {...rest} {...props} />
          {footer && <h1 className=" text-center">FOOTER</h1>}
        </>
        :
        <Component {...rest} {...props} />;

      return (auth && user) ? (
        newComponent
      ) :
        (
          auth ? (
            (Redirected) ?  // to prevent infinite redirection.(maximum-depth exceeded error).
              <Component />
              :
              <Redirect to={{ pathname: '/sign-in', state: { from: location } }} />
          ) :
            <Component />
        );

    }} />
  );
};

export default inject('store')(observer(PageRoute));