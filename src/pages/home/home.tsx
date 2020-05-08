import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './home.scss';
import Store from '../../store';
import { Teaching } from '../../components/Illustrations';
import ClassCard from '../../components/ClassCard';

const Home: FC = () => {
  let content;
  if (!courses || courses.length == 0) {
    content = (
      <>
        <Teaching className="teaching-illustrator" />
        <p className="teaching-p">You have no class right now.</p>
      </>
    );
  } else {
    content = (
      <div className="Home-classes">
        {courses.map(function (item, i) {
          return <ClassCard key={i} card={item} />;
        })}
      </div>
    );
  }

  return (
    <div className="Home">
      <div className="Home-container">{content}</div>
    </div>
  );
};

//const courses = [];

const courses = [
  {
    createdAt: '2020-04-27T15:17:08.262+0000',
    updatedAt: '2020-04-27T16:20:57.235+0000',
    id: 4,
    title: 'DOM',
    term: 'Spring',
    teacher: {
      id: 9,
      createdAt: '2020-04-27T15:14:44.636+0000',
      updatedAt: '2020-04-27T15:14:44.636+0000',
      name: 'Adil',
      surname: 'Alpkoçak',
      email: 'adil.alpkocak@ceng.deu.edu.tr',
      roles: [
        {
          createdAt: '2020-04-25T10:19:34.497+0000',
          updatedAt: '2020-04-25T10:19:34.497+0000',
          id: 3,
          name: 'ROLE_TEACHER',
        },
      ],
    },
  },
  {
    createdAt: '2020-04-27T15:17:08.262+0000',
    updatedAt: '2020-04-27T16:20:57.235+0000',
    id: 4,
    title: 'DOM',
    term: 'Spring',
    teacher: {
      id: 9,
      createdAt: '2020-04-27T15:14:44.636+0000',
      updatedAt: '2020-04-27T15:14:44.636+0000',
      name: 'Adil',
      surname: 'Alpkoçak',
      email: 'adil.alpkocak@ceng.deu.edu.tr',
      roles: [
        {
          createdAt: '2020-04-25T10:19:34.497+0000',
          updatedAt: '2020-04-25T10:19:34.497+0000',
          id: 3,
          name: 'ROLE_TEACHER',
        },
      ],
    },
  },
  {
    createdAt: '2020-04-27T15:17:08.262+0000',
    updatedAt: '2020-04-27T16:20:57.235+0000',
    id: 4,
    title: 'DOM',
    term: 'Spring',
    teacher: {
      id: 9,
      createdAt: '2020-04-27T15:14:44.636+0000',
      updatedAt: '2020-04-27T15:14:44.636+0000',
      name: 'Adil',
      surname: 'Alpkoçak',
      email: 'adil.alpkocak@ceng.deu.edu.tr',
      roles: [
        {
          createdAt: '2020-04-25T10:19:34.497+0000',
          updatedAt: '2020-04-25T10:19:34.497+0000',
          id: 3,
          name: 'ROLE_TEACHER',
        },
      ],
    },
  },
  {
    createdAt: '2020-04-27T15:17:08.262+0000',
    updatedAt: '2020-04-27T16:20:57.235+0000',
    id: 4,
    title: 'DOM',
    term: 'Spring',
    teacher: {
      id: 9,
      createdAt: '2020-04-27T15:14:44.636+0000',
      updatedAt: '2020-04-27T15:14:44.636+0000',
      name: 'Adil',
      surname: 'Alpkoçak',
      email: 'adil.alpkocak@ceng.deu.edu.tr',
      roles: [
        {
          createdAt: '2020-04-25T10:19:34.497+0000',
          updatedAt: '2020-04-25T10:19:34.497+0000',
          id: 3,
          name: 'ROLE_TEACHER',
        },
      ],
    },
  },
];

export default inject('store')(observer(Home));
