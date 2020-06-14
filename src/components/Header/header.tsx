import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Plus } from '../Icons';
import './header.scss';
import ReactModal from 'react-modal';
import CreateClass from '../CreateClass';
import AttendClass from '../AttendClass';
import Button from '@material-ui/core/Button';

interface IProps {
  store?: Store;
}

const Header: FC<IProps> = ({ store }) => {
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showAttendIntoModal, setShowAttendIntoModal] = useState(false);
  const { user, isTeacher } = store!.user;
  let Redirected = false;

  const createClass = () => {
    setShowCreateClassModal(true);
  };
  const attendToClass = () => {
    setShowAttendIntoModal(true);
  };
  const history = useHistory();
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            CengOnline
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              {isTeacher() && (
                <li className="nav-item">
                  <Button className="nav-link mr-2 " onClick={createClass}>
                    <Plus />
                    <span>Create a Class</span>
                  </Button>
                </li>
              )}
              {!isTeacher() && (
                <li className="nav-item">
                  <Button variant="contained" className="nav-link mr-2 " onClick={attendToClass}>
                    <Plus />
                    <span>Attend to Class</span>
                  </Button>
                </li>
              )}
              <li className="nav-item">
                <Button href="#text-buttons">
                  <Link to="/messages" className="nav-link">
                    Messages
                  </Link>
                </Button>
              </li>
              <li className="nav-item ml-md-5 logout-item">
                <Button
                  variant="outlined"
                  className="authentication-button"
                  onClick={() => {
                    store.auth.logout();
                  }}
                >
                  Logout
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <ReactModal
        isOpen={showCreateClassModal}
        contentLabel="Minimal Modal Example"
        className="class-modal"
        ariaHideApp={false}
        onRequestClose={() => {
          setShowCreateClassModal(false);
        }}
        closeTimeoutMS={50}
      >
        <div className="modal-container">
          <CreateClass
            closeModal={() => {
              setShowCreateClassModal(false);
            }}
          />
        </div>
      </ReactModal>
      <ReactModal
        isOpen={showAttendIntoModal}
        contentLabel="Minimal Modal Example"
        className="class-modal"
        ariaHideApp={false}
        onRequestClose={() => {
          setShowAttendIntoModal(false);
        }}
        closeTimeoutMS={50}
      >
        <div className="modal-container">
          <AttendClass
            closeModal={() => {
              setShowAttendIntoModal(false);
            }}
          />
        </div>
      </ReactModal>
    </header>
  );
};

export default inject('store')(observer(Header));
