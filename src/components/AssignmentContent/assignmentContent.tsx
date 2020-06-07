import React, { FC } from 'react';
import { observer, inject } from 'mobx-react';
import Store from '../../store';

import './assignmentContent.scss';

interface IProps {
  store?: Store;
  teacherName: string;
  date: Date;
  dueDate: Date;
  submitted: boolean;
  title: string;
  content: string;
}

const AssignmentContent: FC<IProps> = ({
  teacherName,
  date,
  dueDate,
  submitted,
  title,
  content,
  store,
}) => {
  const dateTime = new Date(date);
  const minutes = dateTime.getMinutes();
  const hours = dateTime.getHours();

  let minutesString = minutes < 10 ? `0${minutes}` : minutes;
  let hoursString = hours < 10 ? `0${hours}` : hours;
  const dateString = `${dateTime.toLocaleDateString()} ${hoursString}:${minutesString}`;

  return (
    <div className="assignment-detail">
      <div className="assignment-firstline">
        <span>{teacherName}</span>
        {/* TODO: handle duedate time string */}
        <span className="due-date">Due Date: ${dueDate.toLocaleDateString()}</span>
      </div>
      <div className="assignment-secondline">
        <span>{dateString}</span>
        <span className={submitted ? 'submitted' : 'not-submitted'}>
          {submitted ? 'Submitted' : 'Not Submitted'}
        </span>
      </div>
      <h4 className="assignment-title">{title}</h4>
      <div className="assignment-content">{content}</div>
    </div>
  );
};

export default inject('store')(observer(AssignmentContent));
