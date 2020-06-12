import React, { FC } from 'react';
import './createAnnouncement.scss';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Store from '../../store';
import { Typography, Button, Box } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const formSchema = Yup.object().shape({
  description: Yup.string().trim().required('Required'),
});

type IProps = {
  store?: Store;
  courseID: number;
};
const CreateAnnouncement: FC<IProps> = ({ courseID, store }) => {
  return courseID > 0 ? (
    <div className="announcement-create-container border">
      <div className="announcement-create-container__form">
        <Formik
          initialValues={{
            description: '',
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            const { description } = values;
            const {
              announcement: { createAnnouncement },
            } = store;

            const success = await createAnnouncement({ courseID, description });
            if (success) {
              await store!.announcement.fetchAllAnnouncements(courseID);
              setTimeout(() => {
                resetForm();
              }, 1000);
            } else {
              setFieldError('error', 'something went wrong.');
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, values, setFieldValue, handleChange, isSubmitting }) => (
            <Form noValidate>
              <div className="form-group description">
                <Typography variant="h6" component="h6" className="align-self-start mb-4">
                  Publish a new announcement
                </Typography>
                <Box width="100%" mb={2}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    variant="outlined"
                    onChange={handleChange('description')}
                    multiline
                    fullWidth
                    required
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="form__error text-danger"
                  />
                </Box>
              </div>

              <div
                className={`${
                  !values.description ? 'd-none' : 'button-container d-flex justify-content-end'
                } `}
              >
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  ) : null;
};

export default inject('store')(observer(CreateAnnouncement));
