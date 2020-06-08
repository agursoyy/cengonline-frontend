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

  const splitDueDate = dueDate.toString().split(' ');
  const splitDate = splitDueDate[0].split('.');
  const splitTime = splitDueDate[1].split(':');
  const due = new Date(
    Number(splitDate[2]),
    Number(splitDate[1]) - 1,
    Number(splitDate[0]),
    Number(splitTime[0]),
    Number(splitTime[1]),
    0,
  );
  const dMinutes = due.getMinutes();
  const dHours = due.getHours();

  let dMinutesString = dMinutes < 10 ? `0${dMinutes}` : dMinutes;
  let dHoursString = dHours < 10 ? `0${dHours}` : dHours;
  const dDateString = `${due.toLocaleDateString()} ${dHoursString}:${dMinutesString}`;

  return (
    <div className="assignment-detail">
      <div className="assignment-firstline">
        <span>{teacherName}</span>
        <span className="due-date">Due Date: {dDateString}</span>
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
