import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Plus } from '../Icons';
import './header.scss';
import ReactModal from 'react-modal';
import CreateClass from '../CreateClass';

interface IProps {
  store?: Store;
}

const Header: FC<IProps> = ({ store }) => {
  const [showAttendIntoModal, setShowAttendIntoModal] = useState(false);
  const { user, isTeacher } = store!.user;
  let Redirected = false;

  const createClass = () => {
    setShowAttendIntoModal(true);
  };
  return (
    <>
      <header className="Header">
        <div className="Header-container">
          <Link to="/" className="Header-container-title">
            CengOnline
          </Link>
          <div className="nav">
            {
              isTeacher() &&
              <button className="mr-2" onClick={createClass}>
                <Plus />
                <span>Create a Class</span>
              </button>
            }
            <button>
              <Plus />
              <span>Attend to Class</span>
            </button>
            <Link to="/messages">Messages</Link>
            <Link to="/logout">Log Out</Link>
          </div>
        </div>
        <ReactModal
          isOpen={showAttendIntoModal}
          contentLabel="Minimal Modal Example"
          className="class-modal"
          ariaHideApp={false}
        >
          <div className="modal-container">
            <CreateClass closeModal={() => { setShowAttendIntoModal(false); }} />
          </div>
        </ReactModal>
      </header>
    </>
  );
};

export default inject('store')(observer(Header));
