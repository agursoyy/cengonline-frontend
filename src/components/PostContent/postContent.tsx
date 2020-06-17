import React, { FC, useState, FormEvent } from 'react';
import { observer, inject } from 'mobx-react';
import { useParams } from 'react-router-dom';
import Store from '../../store';
import ReactModal from 'react-modal';
import './postContent.scss';
import IPost from '../../interfaces/post';

import { Box, IconButton, Button, Typography, FormControl, Input, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import EditPost from '../EditPost';

import send from '../../static/icons/send.svg';
import AccountCircle from '@material-ui/icons/AccountCircle';



interface IProps {
  store?: Store;
  courseId: number;
  teacherName: string;
  post: IPost;
}

const PostContent: FC<IProps> = ({ teacherName, courseId, post: { id, body, createdAt, updatedAt, comments }, store }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [success, setSuccess] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const { id: courseID } = useParams();

  const toggleForComments = () => {
    setShowComments(!showComments);
  };

  const {
    post: { fetchAllPosts, deletePost: delete_post, addCommentToPost },
    user: { isTeacher },
  } = store;



  const dateTime = new Date(createdAt);
  const dateMinutes = dateTime.getMinutes();
  const dateHours = dateTime.getHours();

  let dateMinutesString = dateMinutes < 10 ? `0${dateMinutes}` : dateMinutes;
  let dateHoursString = dateHours < 10 ? `0${dateHours}` : dateHours;
  const dateString = `${dateTime.toLocaleDateString()} ${dateHoursString}:${dateMinutesString}`;

  const updatedAtDate = new Date(updatedAt);
  const updatedAtMinutes = updatedAtDate.getMinutes();
  const updatedAtHours = updatedAtDate.getHours();

  let updatedAtMinutesString = updatedAtMinutes < 10 ? `0${updatedAtMinutes}` : updatedAtMinutes;
  let updatedAtHoursString = updatedAtHours < 10 ? `0${updatedAtHours}` : updatedAtHours;
  const updatedAtString = `${updatedAtDate.toLocaleDateString()} ${updatedAtHoursString}:${updatedAtMinutesString}`;

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(event.target.value);
  };
  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const success = await addCommentToPost(courseID, id, commentInput);
    if (success) {
      setCommentInput('');
    }
  };
  return (
    <div className="post-container">
      <div className="post-content">
        <div className="post-teacher">
          <div>
            <div>{teacherName}</div>
            <div className="post-date">
              {dateString}{' '}
              {updatedAtDate.getTime() > dateTime.getTime() && `(Updated: ${updatedAtString})`}
            </div>
          </div>
          {isTeacher() && (
            <div className="ann-icons">
              <IconButton aria-label="edit">
                <EditIcon fontSize="small" onClick={() => { setShowEditModal(true); }} />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => { setShowDeleteModal(true); }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          )}
        </div>
        <div className="post-body">{body}</div>
      </div>
      <div className="comment-container">
        <div className={comments.length > 0 ? `comment-container__comments ${showComments && 'show'}` : 'd-none'}>
          <div className="comment-container__comments-count">
            <Button color="primary" onClick={toggleForComments}>{comments.length} class comment{comments.length > 1 && 's'}</Button>
          </div>
          {
            showComments && comments.map((c, index) =>
              <div key={index} className="comment-container__comments-single">
                <div className="user">
                  <div>{c.user.name} {c.user.surname}</div>
                  <div className="post-date">
                    {dateString}{' '}
                    {updatedAtDate.getTime() > dateTime.getTime() && `(Updated: ${updatedAtString})`}
                  </div>
                </div>
                <div className="body">
                  {c.body}
                </div>
              </div>
            )
          }
        </div>
        <form className="comment-container__form" onSubmit={handleCommentSubmit}>
          <div className="">
            <FormControl className="comment-form-group">
              <TextField
                id="outlined-textarea"
                placeholder="Submit a comment..."
                multiline
                fullWidth
                variant="outlined"
                size="small"
                className="comment-text"
                InputProps={{
                  classes: {
                    root: 'cssOutlinedInput',
                    focused: 'cssFocused',
                    notchedOutline: 'notchedOutline'
                  }
                }}
                value={commentInput}
                onChange={handleCommentChange}
              />
              <Button type="submit" className="submit-btn" disabled={!commentInput ? true : false}>
                <img src={send} alt="submit" />
              </Button>
            </FormControl>

          </div>

        </form>
      </div>
      <ReactModal
        isOpen={showEditModal}
        contentLabel="Delete Post"
        className="class-modal"
        ariaHideApp={false}
        onRequestClose={() => {
          setShowEditModal(false);
          setSuccess(true);
        }}
        closeTimeoutMS={50}
      >
        <EditPost
          id={id}
          postBody={body}
          closeModal={() => {
            setShowEditModal(false);
          }}
        />
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
        <div className="modal__container">
          <Box display="flex" flexDirection="column" alignItems="center">
            {success ? (
              <>
                <Typography>Are you sure you want to delete this post?</Typography>
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
                      const deleted = await delete_post({ courseId, postId: id });
                      if (deleted) {
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

export default inject('store')(observer(PostContent));
