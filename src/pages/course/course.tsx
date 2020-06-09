import React, { FC, useEffect, useState } from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CreateAnnouncement from '../../components/CreateAnnouncement';
import CreateAssignment from '../../components/CreateAssignment';
import AnnouncementContent from '../../components/AnnouncementContent';
import AssignmentContent from '../../components/AssignmentContent';

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
        store!.assignment.fetchAllAssignments(CourseID),
      ]);

      setUnMount(true);

      // unsubscribe
      return () => {
        store!.course.course = null;
        store!.announcement.announcements = null;
        store!.assignment.assignments = null;
      };
    };
    fetchData();
  }, []);

  const {
    course: { course },
    user: { user, isTeacher },
  } = store!;

  const announcementsTab = store!.announcement.announcements.length ? (
    store!.announcement.announcements.map((a) => {
      return (
        <AnnouncementContent
          teacherName={`${course.teacher.name} ${course.teacher.surname}`}
          date={a.createdAt}
          content={a.description}
          key={`announcement-${a.id}`}
        />
      );
    })
  ) : (
      <p>No announcement in this course yet!</p>
    );

  const assignmentsTab = store!.assignment.assignments.length ? (
    store!.assignment.assignments.map((a) => {
      return (
        <AssignmentContent
          teacherName={`${course.teacher.name} ${course.teacher.surname}`}
          date={a.createdAt}
          content={a.description}
          title={a.title}
          dueDate={a.dueDate}
          submitted={false}
          key={`assignment-${a.id}`}
        />
      );
    })
  ) : (
      <p>No assignment in this course yet!</p>
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
            <div className="col-sm-8">
              <div className="course-container__content border">
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
                      <div
                        className={
                          !isTeacher() ? 'd-none' : 'course-container__content__create-assignment'
                        }
                      >
                        <CreateAssignment courseID={CourseID} />
                      </div>
                      {assignmentsTab}
                    </div>
                  </TabPanel>
                </Tabs>
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
