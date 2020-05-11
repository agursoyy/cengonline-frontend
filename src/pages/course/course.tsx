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

  return unMount ? (
    course ? (
      <div className="course-container">
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <div className="border">Left Side Component</div>
            </div>
            <div className="col-sm-7 pl-sm-3 pr-sm-3 course-container__content">
              <Tabs>
                <TabList>
                  <Tab>Announcements</Tab>
                  <Tab>Courses</Tab>
                </TabList>

                <TabPanel>
                  <div className="react-tabs__tab-panel__course-announcement">
                    <h2>Any content 2</h2>
                    <div
                      className={!isTeacher() ? 'd-none' : 'course-container__content__create-announcement'}
                    >
                      <CreateAnnouncement />
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="react-tabs__tab-panel__course-assignment">
                    <h2>Any content 1</h2>
                  </div>
                </TabPanel>
              </Tabs>

              <div className={!isTeacher() ? 'd-none' : 'course-container__content__timeline'}>
                <h2>Timeline</h2>
              </div>
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
