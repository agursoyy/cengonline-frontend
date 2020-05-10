import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';

import './classCard.scss';

interface IProps {
  card: any;
  store?: Store;
  [x: string]: any;
}

const ClassCard: FC<IProps> = ({ card, store, ...props }) => {
  let teacher;
  if (typeof card.teacher === 'object') {
    teacher = `${card.teacher.name} ${card.teacher.surname}`;
  } else {
    const course = store?.course.courses.find((c) => c.teacher.id === card.teacher);
    teacher = `${course.teacher.name} ${course.teacher.surname}`;
  }

  return (
    <div className="class">
      <Link to={`/course/${card.id}`}>
        <h3>{card.title}</h3>
        <p>{card.term}</p>
        <p>{teacher}</p>
      </Link>
    </div>
  );
};

export default inject('store')(observer(ClassCard));
