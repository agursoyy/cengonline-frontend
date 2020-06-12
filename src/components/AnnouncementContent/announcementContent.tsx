import React, { FC, useState } from 'react';
import { observer, inject } from 'mobx-react';
import { useParams } from 'react-router-dom';
import Store from '../../store';
import ReactModal from 'react-modal';

import { Box, IconButton, Button, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import EditAnnouncement from '../EditAnnouncement';
import CreateClass from '../CreateClass';

import './announcementContent.scss';

interface IProps {
  store?: Store;
  id: any;
  teacherName: string;
  date: Date;
  content: string;
}

const AnnouncementContent: FC<IProps> = ({ id, teacherName, date, content, store }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [success, setSuccess] = useState(true);

  const { id: courseID } = useParams();

  const {
    announcement: { fetchAllAnnouncements, deleteAnnouncement: deleteAnn },
  } = store;

  const editAnnouncement = () => {
    setShowEditModal(true);
  };

  const deleteAnnouncement = () => {
    setShowDeleteModal(true);
  };

  const dateTime = new Date(date);
  const minutes = dateTime.getMinutes();
  const hours = dateTime.getHours();

  let minutesString = minutes < 10 ? `0${minutes}` : minutes;
  let hoursString = hours < 10 ? `0${hours}` : hours;
  const dateString = `${dateTime.toLocaleDateString()} ${hoursString}:${minutesString}`;

  return (
    <div className="announcement-detail">
      <div className="announcement-teacher">
        <div>
          <div>{teacherName}</div>
          <div className="announcement-date">{dateString}</div>
        </div>
        <div className="ann-icons">
          <IconButton aria-label="edit">
            <EditIcon fontSize="small" onClick={editAnnouncement} />
          </IconButton>
          <IconButton aria-label="delete" onClick={deleteAnnouncement}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <div className="announcement-content">{content}</div>
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
        <EditAnnouncement id={id} announcementText={content} closeModal={() => { setShowEditModal(false); }} />
      </ReactModal>
      <ReactModal
        isOpen={showDeleteModal}
        contentLabel="Delete Announcement"
        className="class-modal"
        ariaHideApp={false}
        onRequestClose={() => {
          setShowDeleteModal(false);
          setSuccess(true);
        }}
        closeTimeoutMS={50}
      >
        <div className="modal-container">
          <Box display="flex" flexDirection="column" alignItems="center">
            {success ? (
              <>
                <Typography>Are you sure you want to delete this announcement?</Typography>
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
                    color='secondary'
                    onClick={async () => {
                      const deleted = await deleteAnn(id);
                      if (deleted) {
                        await fetchAllAnnouncements(courseID);
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

export default inject('store')(observer(AnnouncementContent));
