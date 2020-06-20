import React, { FC, useState, useEffect } from 'react';
import './allUsers.scss';
import Store from '../../store';
import { inject, observer } from 'mobx-react';

import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import MessageIcon from '@material-ui/icons/MailOutline';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(2, 0, 2),
  },
}));

interface IProps {
  store?: Store;
  close: (id: number) => void;
}
const AllUsers: FC<IProps> = ({
  close,
  store: {
    message: { getAllChatters },
  },
}) => {
  const [chatters, setChatters] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    (async function () {
      const res = await getAllChatters();
      setChatters(res);
    })();
  }, []);

  return chatters.length > 0 ? (
    <div className="messages-grid">
      <Grid>
        <Typography variant="h6" className={classes.title}>
          All Users
        </Typography>
        <div className={classes.demo}>
          <List dense>
            {chatters.map((c, index) => (
              <ListItem key={`chatter-${index}`}>
                <ListItemText>
                  <div className="chatter">
                    <span className="chatter-name">
                      {c.name} {c.surname}
                    </span>
                    <span className="chatter-email">{c.email}</span>
                  </div>
                </ListItemText>
                <ListItemSecondaryAction>
                  <Tooltip title="Send Message" arrow>
                    <IconButton
                      edge="end"
                      aria-label="send message"
                      onClick={() => {
                        close(Number(c.id));
                      }}
                    >
                      <MessageIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </Grid>
    </div>
  ) : null;
};

export default inject('store')(observer(AllUsers));
