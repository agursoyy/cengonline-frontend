import React, { FC, useEffect, useState } from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CreateAnnouncement from '../../components/CreataAnnouncement';

import './course.scss';

type IProps = {
  store?: Store;
};

const Course: FC<IProps> = ({ store }) => {
  const [unMount, setUnMount] = useState(false);
  const { id: CourseID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        store!.course.fetchCourse(CourseID),
        store!.announcement.fetchAllAnnouncements(CourseID),
      ]);

      setUnMount(true);

      // unsubscribe
      return () => {
        store!.course.course = null;
        store!.announcement.announcements = null;
      };
    };
    fetchData();
  }, []);

  const {
    course: { course },
    user: { user, isTeacher },
  } = store!;

  const timelineOfAnnouncements = store!.announcement.announcements.map((a) => {
    const dateTime = new Date(a.createdAt);
    const minutes = dateTime.getMinutes();
    const hours = dateTime.getHours();

    let minutesString = minutes < 10 ? `0${minutes}` : minutes;
    let hoursString = hours < 10 ? `0${hours}` : hours;
    const dateString = `${dateTime.toLocaleDateString()} ${hoursString}:${minutesString}`;

    return (
      <div className="announcement-detail" key={`announcement-${a.id}`}>
        <div className="announcement-teacher">
          {course.teacher.name} {course.teacher.surname}
        </div>
        <div className="announcement-date">{dateString}</div>
        <div className="announcement-content">{a.description}</div>
      </div>
    );
  });

  const announcementsTab = !store!.announcement.announcements.length ? (
    <p>No announcement in this course yet!</p>
  ) : (
    timelineOfAnnouncements
  );

  return unMount ? (
    course ? (
      <div className="course-container">
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <div className="sidebar border">
                <div className="sidebar-title">{course.title}</div>
                <div className="sidebar-term">{course.term}</div>
                <div className="sidebar-teacher">
                  {course.teacher.name} {course.teacher.surname}
                </div>
              </div>
            </div>
            <div className="col-sm-8 pl-sm-4 pr-sm-4 course-container__content border">
              <Tabs>
                <TabList>
                  <Tab>Announcements</Tab>
                  <Tab>Assignments</Tab>
                </TabList>

                <TabPanel>
                  <div className="react-tabs__tab-panel__course-announcement">
                    <div
                      className={
                        !isTeacher() ? 'd-none' : 'course-container__content__create-announcement'
                      }
                    >
                      <CreateAnnouncement courseID={CourseID} />
                    </div>
                    {announcementsTab}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="react-tabs__tab-panel__course-assignment">
                    <p>Assignments hallo</p>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    )
  ) : null;
};

export default inject('store')(observer(Course));
