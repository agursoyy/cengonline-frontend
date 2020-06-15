import React, { FC } from 'react';
import { observer, inject } from 'mobx-react';
import Store from '../../store';

import './submissions.scss';

interface IProps {
  store?: Store;
}

const Submissions: FC<IProps> = ({ store }) => {
  const {
    assignment: { submissionsOfAssignment },
  } = store;

  const toDateString = (date) => {
    const dateTime = new Date(date);
    const minutes = dateTime.getMinutes();
    const hours = dateTime.getHours();
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const hoursString = hours < 10 ? `0${hours}` : hours;

    return `${dateTime.toLocaleDateString()} ${hoursString}:${minutesString}`;
  };

  let submissions;
  if (submissionsOfAssignment && submissionsOfAssignment.length > 0) {
    submissions = submissionsOfAssignment.map((s) => (
      <div className="submission" key={`submission-${s.id}`}>
        <div className="submission-user">
          {s.user.name} {s.user.surname}
        </div>
        <div className="submission-date">{toDateString(s.createdAt)}</div>
        <p className="submission-content">{s.content}</p>
      </div>
    ));
  } else {
    submissions = <p>No submission yet!</p>;
  }

  return (
    <div className="submissions">
      <div className="submissions-title">Submissions of the assignment</div>
      {submissions}
    </div>
  );
};

export default inject('store')(observer(Submissions));
