import React, { FC, useEffect, useState } from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './course.scss';
import Store from '../../store';

import { Teaching } from '../../components/Illustrations';
import CreateAnnouncement from '../../components/CreataAnnouncement';
type IProps = {
  store?: Store
};


const Course: FC<IProps> = ({ store }) => {
  const [unMount, setUnMount] = useState(false);
  let { id } = useParams();
  const CourseID = id;

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([store!.course.fetchCourse(CourseID), store!.announcement.fetchAllAnnouncements(CourseID)]);

      setUnMount(true);
      console.log(store);


      // unsubscribe
      return () => {
        store!.course.course = null;
        store!.announcement.announcements = null;
      };
    };
    fetchData();
  }, []);




  const { course: { course }, user: { user, isTeacher } } = store!;
  let content;
  /*if (!courses || courses.length === 0) {
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
  }*/
  console.log(user);
  return (
    unMount ?
      course ? (
        <div className="course-container">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className="border">Left Side Component</div>
              </div>
              <div className="col-sm-7 pl-sm-3 pr-sm-3 border course_container__content">
                <div className={`${!isTeacher ? 'd-none' : 'course-container__content__create-announcement'}`}>
                  <CreateAnnouncement />
                </div>
                <div className={`${!isTeacher ? 'd-none' : 'course-container__content__timeline'}`}>
                  <h2>Timeline</h2>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
        :
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      :
      null
  );
};

//const courses = [];



export default inject('store')(observer(Course));
