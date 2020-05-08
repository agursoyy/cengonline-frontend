import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Plus } from '../Icons';

import './header.scss';

interface IProps {
  store?: Store;
}

const Header: FC<IProps> = ({ store }) => {
  const { user } = store!.user;
  let Redirected = false;

  return (
    <>
      <header className="Header">
        <div className="Header-container">
          <Link to="/" className="Header-container-title">
            CengOnline
          </Link>
          <div className="nav">
            <button>
              <Plus />
              <span>Attend to Class</span>
            </button>
            <Link to="/messages">Messages</Link>
            <Link to="/logout">Log Out</Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default inject('store')(observer(Header));
