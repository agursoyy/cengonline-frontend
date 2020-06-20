import React, { FC, useState, useEffect } from 'react';
import './messageBox.scss';
import Store from '../../store';
import IUser from '../../interfaces/user';
import { Box, IconButton, Button, Typography, FormControl, Input, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import send from '../../static/icons/send.svg';
import { inject, observer } from 'mobx-react';

interface IProps {
  store?: Store;
  receiverId: number
}
const MessageBox: FC<IProps> = ({ receiverId, store: { message: { messages, fetchAllMessages, sendMessage }, user: { user },
  course: { studentsOfCourse } } }) => {
  const receiver = studentsOfCourse.filter(s => s.id === receiverId)[0];
  const [messageInput, setMessageInput] = useState('');
  useEffect(() => {
    const fetchMessages = async () => {
      await fetchAllMessages(receiverId);
    };
    fetchMessages();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  const handleMessageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (messageInput) {
      await sendMessage(receiverId, messageInput);
      setMessageInput('');
    }
  };
  return (
    <div className="message-box">
      <div className="message-box__header">
        <div className="first-letter">{receiver.name[0] + receiver.surname[0]}</div>
        <div className="receiver-name">{receiver.name}{' '}{receiver.surname} </div>
      </div>
      <div className="message-box__body">
        {
          messages.map((m, index) => {
            if (m.receiver.id === user.id) {
              return (
                <div key={index} className="incoming">
                  <div className="bubble">
                    {m.content}
                  </div>
                </div>
              );
            }
            else {
              return (
                <div key={index} className="outgoing">
                  <div className="bubble">
                    {m.content}
                  </div>
                </div>
              );
            }
          })
        }

      </div>
      <div className="message-box__footer">
        <form noValidate onSubmit={handleMessageSubmit}>
          <FormControl className="message-form-group">
            <TextField
              placeholder="Type your message..."
              multiline
              fullWidth
              variant="outlined"
              size="small"
              className="message-input"
              InputProps={{
                classes: {
                  root: 'cssOutlinedInput',
                  focused: 'cssFocused',
                  notchedOutline: 'notchedOutline'
                }
              }}
              value={messageInput}
              onChange={handleInputChange}
            />
            <Button type="submit" className="submit-btn" disabled={!messageInput ? true : false} >
              <img src={send} alt="submit" />
            </Button>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default inject('store')(observer(MessageBox));

