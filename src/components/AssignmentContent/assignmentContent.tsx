import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Store from '../../store';

import ReactModal from 'react-modal';

import { Box, IconButton, Button, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import Tooltip from '@material-ui/core/Tooltip';

import EditAssignment from '../EditAssignment';
import SubmitAssignment from '../SubmitAssignment';
import Submissions from '../Submissions';

import './assignmentContent.scss';

interface IProps {
  store?: Store;
  id: any;
  teacherName: string;
  date: Date;
  updatedAt: Date;
  dueDate: Date;
  submitted: boolean;
  title: string;
  content: string;
}

const AssignmentContent: FC<IProps> = ({
  id,
  teacherName,
  date,
  updatedAt,
  dueDate,
  submitted,
  title,
  content,
  store,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [success, setSuccess] = useState(true);

  const { id: courseID } = useParams();

  const {
    assignment: {
      fetchAllAssignments,
      fetchSubmissionsOfAssignment,
      submissionsOfAssignment,
      deleteAssignment: deleteAsn,
    },
    user: { isTeacher },
  } = store;

  const editAnnouncement = () => {
    setShowEditModal(true);
  };

  const deleteAnnouncement = () => {
    setShowDeleteModal(true);
  };

  const displaySubmissions = async () => {
    await fetchSubmissionsOfAssignment(Number(id));
    setShowSubmissions(true);
  };

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

  const updatedAtDate = new Date(updatedAt);
  const updatedAtMinutes = updatedAtDate.getMinutes();
  const updatedAtHours = updatedAtDate.getHours();

  let updatedAtMinutesString = updatedAtMinutes < 10 ? `0${updatedAtMinutes}` : updatedAtMinutes;
  let updatedAtHoursString = updatedAtHours < 10 ? `0${updatedAtHours}` : updatedAtHours;
  const updatedAtString = `${updatedAtDate.toLocaleDateString()} ${updatedAtHoursString}:${updatedAtMinutesString}`;

  const work = store!.assignment.submissionsOfStudent.find((s) => s.assignment.id == id);
  let workDateString;
  if (work) {
    const workDate = new Date(work.createdAt);
    const workDateHours = workDate.getHours();
    const workDateMinutes = workDate.getMinutes();
    const workDateHoursString = workDateHours < 10 ? `0${workDateHours}` : workDateHours;
    const workDateMinutesString = workDateMinutes < 10 ? `0${workDateMinutes}` : workDateMinutes;
    workDateString = `${workDate.toLocaleDateString()} ${workDateHoursString}:${workDateMinutesString}`;
  }

  return (
    <div className="assignment-detail">
      <div className="assignment-firstline">
        <span>{teacherName}</span>
        <span className="due-date">Due Date: {dDateString}</span>
      </div>
      <div className="assignment-secondline">
        <span>
          {dateString}{' '}
          {updatedAtDate.getTime() > dateTime.getTime() && `(Updated: ${updatedAtString})`}
        </span>
        {!isTeacher() && (
          <span className={submitted ? 'submitted' : 'not-submitted'}>
            {submitted ? 'Submitted' : 'Not Submitted'}
          </span>
        )}
      </div>
      <h4 className="assignment-title" style={isTeacher() ? { marginTop: '-15px' } : {}}>
        <p>{title}</p>
        {isTeacher() && (
          <Box>
            <Tooltip title="View Submissions" arrow>
              <IconButton aria-label="view" onClick={displaySubmissions}>
                <ViewHeadlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Assignment" arrow>
              <IconButton aria-label="edit" onClick={editAnnouncement}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Assignment" arrow>
              <IconButton aria-label="delete" onClick={deleteAnnouncement}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </h4>
      <div className="assignment-content">{content}</div>
      {!submitted && !isTeacher() && new Date().getTime() <= due.getTime() && (
        <SubmitAssignment courseID={courseID} assignmentID={Number(id)} />
      )}
      {submitted && !isTeacher() && (
        <>
          <h4 className="assignment-title mt-4">Your Work:</h4>
          <div className="assignment-secondline">{workDateString}</div>
          <div className="assignment-content">{work.content}</div>
        </>
      )}
      <ReactModal
        isOpen={showSubmissions}
        contentLabel="Display Submissions"
        className="class-modal"
        ariaHideApp={false}
        onRequestClose={() => {
          setShowSubmissions(false);
        }}
        closeTimeoutMS={50}
      >
        <Submissions />
      </ReactModal>
      <ReactModal
        isOpen={showEditModal}
        contentLabel="Delete Announcement"
        className="class-modal"
        ariaHideApp={false}
        onRequestClose={() => {
          setShowEditModal(false);
          setSuccess(true);
        }}
        closeTimeoutMS={50}
      >
        <EditAssignment
          id={Number(id)}
          titleP={title}
          descriptionP={content}
          dueDateP={dueDate}
          closeModal={() => {
            setShowEditModal(false);
          }}
        />
      </ReactModal>
      <ReactModal
        isOpen={showDeleteModal}
        contentLabel="Delete Assignment"
        className="class-modal"
        ariaHideApp={false}
        onRequestClose={() => {
          setShowDeleteModal(false);
          setSuccess(true);
        }}
        closeTimeoutMS={50}
      >
        <div className="modal__container">
          <Box display="flex" flexDirection="column" alignItems="center">
            {success ? (
              <>
                <Typography>Are you sure you want to delete this assignment?</Typography>
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
                      const deleted = await deleteAsn(id);
                      if (deleted) {
                        await fetchAllAssignments(courseID);
                        setTimeout(() => {
                          setShowDeleteModal(false);
                        }, 500);
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
        </div>
      </ReactModal>
    </div>
  );
};

export default inject('store')(observer(AssignmentContent));
