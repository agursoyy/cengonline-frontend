import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';

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
  // All other props
  [x: string]: any;
}

const PrivateRoute: FC<IProps> = ({ pageConfiguration, Component, ...rest }) => {
  const config: IpageConfig = {
    ...pageConfig,
    ...pageConfiguration
  };
  const { layout, header, footer, auth } = config;
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
      /* return Auth.isUserAuthenticated() ? (
         newComponent
       ) : (
           <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
         ); */
      return newComponent;

    }} />
  );
};

export default PrivateRoute;