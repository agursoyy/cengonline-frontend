import React, { FC } from 'react';
import { observer, inject } from 'mobx-react';
import Store from '../../store';

import './announcementContent.scss';

interface IProps {
  store?: Store;
  teacherName: string;
  date: Date;
  content: string;
}

const AnnouncementContent: FC<IProps> = ({ teacherName, date, content, store }) => {
  const dateTime = new Date(date);
  const minutes = dateTime.getMinutes();
  const hours = dateTime.getHours();

  let minutesString = minutes < 10 ? `0${minutes}` : minutes;
  let hoursString = hours < 10 ? `0${hours}` : hours;
  const dateString = `${dateTime.toLocaleDateString()} ${hoursString}:${minutesString}`;

  return (
    <div className="announcement-detail">
      <div className="announcement-teacher">{teacherName}</div>
      <div className="announcement-date">{dateString}</div>
      <div className="announcement-content">{content}</div>
    </div>
  );
};

export default inject('store')(observer(AnnouncementContent));
