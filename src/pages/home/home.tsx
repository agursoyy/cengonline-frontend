import React, { FC, useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Teaching } from '../../components/Illustrations';
import ClassCard from '../../components/ClassCard';

import './home.scss';

type IProps = {
  store?: Store;
};
const Home: FC<IProps> = ({ store }) => {
  const [unMount, setUnMount] = useState(false);
  useEffect(() => {
    const fetchCourses = async () => {
      await store!.course.fetchAllCourses();
      setUnMount(true);
    };
    fetchCourses();
  }, []);
  const {
    course: { courses },
  } = store!;
  let content;
  if (!courses || courses.length === 0) {
    content = (
      <>
        <Teaching className="teaching-illustrator" />
        <p className="teaching-p">You have no class right now.</p>
      </>
    );
  } else {
    content = (
      <div className="container">
        <div className="Home-classes">
          <div className="row">
            {courses.map(function (item, i) {
              return <div key={i} className="col-sm-6 col-md-4 class-column"><ClassCard card={item} /></div>;
            })
            }
          </div>
        </div>
      </div>
    );
  }

  return unMount ? (
    <div className="Home">
      <div className="Home-container">{content}</div>
    </div>
  ) : null;
};

export default inject('store')(observer(Home));
