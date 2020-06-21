import React, { FC, useEffect, useState } from 'react';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CreateAnnouncement from '../../components/CreateAnnouncement';
import CreatePost from '../../components/CreatePost';
import CreateAssignment from '../../components/CreateAssignment';
import AnnouncementContent from '../../components/AnnouncementContent';
import PostContent from '../../components/PostContent';
import AssignmentContent from '../../components/AssignmentContent';
import { Box, IconButton, Button, Typography } from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MailOutline as MessageIcon,
} from '@material-ui/icons';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import ReactModal from 'react-modal';
import './course.scss';
import EditCourse from '../../components/EditCourse';
import MessageBox from '../../components/MessageBox';

type IProps = {
  store?: Store;
};

const useStateCallbackWrapper = (initilValue, callBack) => {
  const [state, setState] = useState(initilValue);
  useEffect(() => callBack(state), [state]);
  return [state, setState];
};

const Course: FC<IProps> = ({ store }) => {
  const [unMount, setUnMount] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [success, setSuccess] = useState(true);
  const [messageReceiverId, setMessageReceiverId] = useState(-1);
  const { id: CourseID } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        store!.course.fetchCourse(CourseID),
        store!.course.fetchStudents(CourseID),
        store!.announcement.fetchAllAnnouncements(CourseID),
        store!.post.fetchAllPosts(CourseID),
        store!.assignment.fetchAllAssignments(CourseID),
        store!.assignment.fetchSubmissionsOfStudent(store!.user.user.id),
      ]);

      setUnMount(true);

      // unsubscribe
      return () => {
        store!.course.course = null;
        store!.course.studentsOfCourse = null;
        store!.announcement.announcements = null;
        store!.assignment.assignments = null;
        store!.assignment.submissionsOfStudent = null;
      };
    };
    fetchData();
  }, []);

  const {
    course: { course, studentsOfCourse, deleteCourse },
    user: { user, isTeacher },
  } = store!;

  const sendMessage = (receiverId: number) => {
    setMessageReceiverId(receiverId);
    setShowMessageBox(true);
  };
  const announcementsTab = store!.announcement.announcements.length ? (
    store!.announcement.announcements.map((a) => {
      return (
        <AnnouncementContent
          id={a.id}
          teacherName={`${course.teacher.name} ${course.teacher.surname}`}
          date={a.createdAt}
          updatedAt={a.updatedAt}
          content={a.description}
          key={`announcement-${a.id}`}
        />
      );
    })
  ) : (
      <p>No announcement in this course yet!</p>
    );
  const postsTab = store!.post.posts.length ? (
    store!.post.posts.map((p) => {
      return (
        <PostContent
          teacherName={`${course.teacher.name} ${course.teacher.surname}`}
          courseId={course.id}
          post={p}
          key={`posts-${p.id}`}
        />
      );
    })
  ) : (
      <p>No post in this course yet!</p>
    );

  const assignmentsTab = store!.assignment.assignments.length ? (
    store!.assignment.assignments.map((a) => {
      let isSubmitted = false;

      if (!isTeacher()) {
        const submission = a.submissions.find(
          (s) => s.user.id === store!.user.user.id || s.user === store!.user.user.id,
        );
        if (submission) {
          isSubmitted = true;
        }
      }

      return (
        <AssignmentContent
          id={a.id}
          teacherName={`${course.teacher.name} ${course.teacher.surname}`}
          date={a.createdAt}
          updatedAt={a.updatedAt}
          content={a.description}
          title={a.title}
          dueDate={a.dueDate}
          submitted={isSubmitted}
          key={`assignment-${a.id}`}
        />
      );
    })
  ) : (
      <p>No assignment in this course yet!</p>
    );

  const handleShowStudents = () => {
    if (studentsOfCourse.length > 0) {
      setShowStudents(!showStudents);
    }
  };

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
                  <span className="mr-2">
                    {course.teacher.name} {course.teacher.surname}
                  </span>
                  {!isTeacher() && (
                    <Tooltip title="Send Message" arrow placement="right">
                      <IconButton
                        aria-label="new-message"
                        onClick={() => {
                          sendMessage(course.teacher.id);
                        }}
                      >
                        <MessageIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                {isTeacher() && (
                  <>
                    <div className="sidebar-code">
                      Course Code: <span>{course.id}</span>
                    </div>
                    <div className="sidebar__edit-course">
                      <Tooltip title="Edit Course" arrow placement="top">
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            setShowEditModal(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course" arrow placement="top">
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setShowDeleteModal(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </>
                )}
                <div className="students">
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={
                      studentsOfCourse.length > 0 &&
                      (showStudents ? <ExpandLessIcon /> : <ExpandMoreIcon />)
                    }
                    onClick={handleShowStudents}
                  >
                    <span>Students ({studentsOfCourse.length})</span>
                  </Button>
                  <Collapse in={showStudents} timeout="auto" unmountOnExit>
                    {studentsOfCourse &&
                      showStudents &&
                      studentsOfCourse.length > 0 &&
                      studentsOfCourse.map((s) => (
                        <div className="student" key={`student-${s.id}`}>
                          <div className="student-info">
                            <div className="student-info-name">
                              {s.name} {s.surname}
                            </div>
                            <div className="student-info-email">{s.email}</div>
                          </div>
                          {s.id !== store.user.user.id && (
                            <div className="new-message-btn">
                              <Tooltip title="Send Message" arrow>
                                <IconButton
                                  aria-label="new-message"
                                  onClick={() => {
                                    console.log('pressed');
                                    sendMessage(s.id);
                                  }}
                                >
                                  <MessageIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      ))}
                  </Collapse>
                </div>
              </div>
            </div>
            <div className="col-sm-8">
              <div className="course-container__content border">
                <Tabs>
                  <TabList>
                    <Tab>Announcements</Tab>
                    <Tab>Posts</Tab>
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
                    <div className="react-tabs__tab-panel__course-post">
                      <div
                        className={
                          !isTeacher() ? 'd-none' : 'course-container__content__create-announcement'
                        }
                      >
                        <CreatePost courseID={CourseID} />
                      </div>
                      {postsTab}
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
        <ReactModal
          isOpen={showEditModal}
          contentLabel="Edit Course"
          className="class-modal"
          ariaHideApp={false}
          onRequestClose={() => {
            setShowEditModal(false);
            //setSuccess(true);
          }}
          closeTimeoutMS={50}
        >
          <EditCourse
            id={CourseID}
            courseTitle={course.title}
            courseTerm={'Spring'}
            closeModal={() => {
              setShowEditModal(false);
            }}
          />
        </ReactModal>
        <ReactModal
          isOpen={showDeleteModal}
          contentLabel="Delete Course"
          className="class-modal"
          ariaHideApp={false}
          onRequestClose={() => {
            setShowDeleteModal(false);
            setSuccess(true);
          }}
          closeTimeoutMS={50}
        >
          <Box
            className="modal__container"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {success ? (
              <>
                <Typography>Are you sure you want to delete this course?</Typography>
                <Box mt={4}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowDeleteModal(false);
                    }}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={async () => {
                      const deleted = await deleteCourse(CourseID);
                      if (deleted) {
                        history.push('/');
                      } else {
                        setSuccess(false);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </>
            ) : (
                <Typography>Something went wrong. Please try again.</Typography>
              )}
          </Box>
        </ReactModal>
        <ReactModal
          isOpen={showMessageBox}
          contentLabel="Edit Course"
          className="class-modal"
          ariaHideApp={false}
          onRequestClose={() => {
            setShowMessageBox(false);
          }}
          closeTimeoutMS={50}
        >
          <MessageBox receiverId={messageReceiverId} />
        </ReactModal>
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
