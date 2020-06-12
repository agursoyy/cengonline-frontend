import React, { FC } from 'react';
import Store from '../../store';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router';

import {
  Typography,
  Button,
  Box,
  Select,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import { id } from 'date-fns/locale';

interface IProps {
  store?: Store;
  id: number;
  announcementText: string
  closeModal: () => void;
}
const formSchema = Yup.object().shape({
  announcement: Yup.string().required('required'),
});

const EditAnnouncement: FC<IProps> = (props) => {
  const { store } = props;
  const { id: courseId } = useParams();
  return (
    <div className="modal__container">
      <div className="title">Edit Announcement</div>
      <Formik
        initialValues={{
          announcement: props.announcementText,
          errorMsg: '',
          successMsg: '',
        }}
        validationSchema={formSchema}
        onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
          const { announcement } = values;
          const {
            announcement: { updateAnnouncement },
          } = store;
          const success = await updateAnnouncement({ courseId: courseId, announcementId: props.id, announcementDescription: announcement });
          if (success) {
            setFieldError('successMsg', 'Announcement has been updated');
            setTimeout(() => {
              props.closeModal();
              setSubmitting(false);
            }, 750);
          } else {
            setFieldError('errorMsg', 'Something has gone wrong');
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          touched,
          values,
          setFieldValue,
          handleChange,
          isSubmitting,
          dirty,
          isValid,
        }) => (
            <Form noValidate>
              <div className="form-group announcement-edit">
                <Box width="100%" mb={2}>
                  <TextField
                    id="announcement-edit"
                    name="announcement"
                    label="Announcement"
                    variant="filled"
                    onChange={handleChange('announcement')}
                    fullWidth
                    required
                  />
                  <ErrorMessage name="title" component="div" className="form__error text-danger" />
                </Box>
              </div>

              <ErrorMessage name="errorMsg" component="div" className="form--error" />
              <ErrorMessage name="successMsg" component="div" className="form--success " />
              <div className={'button-container d-flex justify-content-end'}>
                <Button
                  variant="contained"
                  onClick={() => {
                    props.closeModal();
                  }}
                  className="mr-2"
                >
                  Cancel
              </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!(dirty && isValid)}
                >
                  Submit
              </Button>
              </div>
            </Form>
          )}
      </Formik>
    </div>
  );
};

export default inject('store')(observer(EditAnnouncement));
