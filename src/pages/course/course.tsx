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
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis officia
                      nostrum amet debitis architecto? Impedit eum sequi excepturi, aperiam nesciunt
                      quibusdam delectus veniam aut, nulla ipsam, rem odit exercitationem
                      dignissimos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
                      reiciendis sed error vitae ea sint magni dicta quod laudantium rerum
                      architecto dignissimos sunt, animi praesentium, asperiores assumenda, modi
                      autem culpa. Quidem rerum blanditiis labore atque quos consectetur at modi.
                      Molestias nihil ipsa saepe rem iure alias quia porro! Officia et quis iste
                      pariatur cupiditate error corporis aliquam consectetur laborum maxime. Facilis
                      ratione omnis facere voluptatum accusamus neque debitis cumque sed a quis.
                      Deleniti expedita consequuntur reprehenderit corporis. Dolorem reprehenderit
                      repellat quidem aspernatur nisi ad distinctio beatae dignissimos temporibus
                      neque! Molestiae? Hic possimus officiis tempore libero quas rerum facilis quis
                      temporibus ut iure est nihil itaque a ducimus excepturi, laudantium molestiae
                      eaque reiciendis ipsa unde doloremque dolorum. Aperiam dolorem quam explicabo.
                      Magni repellat commodi veritatis iste vero, laudantium facilis quis, magnam
                      est, velit aut consequuntur dolor quas corporis voluptates in! Ipsum, nihil
                      alias perspiciatis quasi nulla fugit quas quae ipsam maiores? Quam, ut hic
                      recusandae illo fuga a libero adipisci enim quae vitae sapiente fugiat error
                      sunt amet. Atque saepe quos accusantium laboriosam officiis reprehenderit vel
                      inventore beatae, minus rem sed. Magni eveniet nemo commodi molestias ut,
                      omnis laboriosam quasi quaerat fuga. Unde maxime, tempore ab, esse
                      accusantium, expedita nisi labore amet quia numquam dolor magnam? Perspiciatis
                      deleniti labore provident animi? Magni iste delectus eius reiciendis. Delectus
                      fuga blanditiis error nulla veniam voluptatem corporis neque atque deleniti
                      dolorem! Aliquam repudiandae, nihil reprehenderit eaque ad quis repellendus,
                      cumque animi, culpa maxime a.
                    </p>
                    <div
                      className={
                        !isTeacher() ? 'd-none' : 'course-container__content__create-announcement'
                      }
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
