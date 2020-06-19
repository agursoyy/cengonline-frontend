import React, { FC, useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Signup, Login } from '../../pages/authentication';
import Header from '../Header';

const config = require('../../config');
const {
  publicRuntimeConfig: { pageConfig },
} = config;

interface IpageConfig {
  layout?: boolean;
  auth?: boolean;
  footer?: boolean;
  header?: boolean;
}

interface IProps {
  pageConfiguration?: IpageConfig;
  Component: FC;
  store?: Store;
  // All other props
  [x: string]: any;
}

const PageRoute: FC<IProps> = ({ pageConfiguration, Component, store, ...rest }) => {
  const [firstRender, setFirstRender] = useState(false);

  const handleCookieAuth = async (store: Store) => {
    const accessToken = store.cookies.get('accessToken');
    if (accessToken) {
      store.api.accessToken = accessToken;
    }
    if (accessToken) {
      const user = await store.user.getCurrent();

      if (!user) {
        console.log('NO USER');
        store.api.accessToken = undefined;
        store.cookies.remove('accessToken');
      }
    }

    if (!firstRender) {
      setFirstRender(true);
    }

  };

  useEffect(() => {
    const authAsync = async () => {
      await handleCookieAuth(store!);
    };
    authAsync();
  }, []);

  const config: IpageConfig = {
    ...pageConfig,
    ...pageConfiguration,
  };
  const { layout, header, footer, auth } = config;
  const { user } = store!.user;
  const { location, path } = rest;
  let Redirected = false;
  if (location.state && location.state.from.pathname == path) Redirected = true;
  return firstRender ? (
    <Route
      {...rest}
      render={(props) => {
        const newComponent = layout ? (
          <>
            {header && <Header />}
            <Component {...rest} {...props} />
          </>
        ) : (
            <Component {...rest} {...props} />
          );

        return auth && user ? (
          newComponent
        ) : auth ? (  // but user not logged in.
          <Redirect to={{ pathname: '/sign-in', state: { from: location } }} />
        ) : path === '/sign-in' || path === '/sign-up' ? (
          user ? (
            <Redirect to={{ pathname: '/' }} />
          ) : (
              newComponent
            )
        ) : (
                newComponent
              );
      }}
    />
  ) : null;
};

export default inject('store')(observer(PageRoute));
