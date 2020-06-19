import React, { FC } from 'react';
import './createPost.scss';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Store from '../../store';
import { Typography, Button, Box } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const formSchema = Yup.object().shape({
  body: Yup.string().trim().required('Required'),
});

type IProps = {
  store?: Store;
  courseID: number;
};
const CreatePost: FC<IProps> = ({ courseID, store }) => {
  return courseID > 0 ? (
    <div className="post-create-container border">
      <div className="post-create-container__form">
        <Formik
          initialValues={{
            body: '',
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            const { body } = values;
            const {
              post: { createPost },
            } = store;
            const success = await createPost({ courseID, body });
            if (success) {
              setTimeout(() => {
                resetForm();
              }, 500);
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
                  Publish a new post
                </Typography>
                <Box width="100%" mb={2}>
                  <TextField
                    id="body"
                    name="body"
                    label="Description"
                    variant="outlined"
                    onChange={handleChange('body')}
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
                  !values.body ? 'd-none' : 'button-container d-flex justify-content-end'
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

export default inject('store')(observer(CreatePost));
