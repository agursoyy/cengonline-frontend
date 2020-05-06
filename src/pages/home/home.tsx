import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './home.scss';
import Store from '../../store';




const Home: FC = () => {

  return (
    <h1>HELLO, HOME!</h1>
  );
};

export default inject('store')(observer(Home));