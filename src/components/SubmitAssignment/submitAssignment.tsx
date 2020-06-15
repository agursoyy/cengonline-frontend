import React, { FC } from 'react';
import './submitAssignment.scss';
import { observer, inject } from 'mobx-react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Store from '../../store';
import { Typography, Button, Box } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const formSchema = Yup.object().shape({
  content: Yup.string().trim().required('Required'),
});

type IProps = {
  store?: Store;
  assignmentID: number;
  courseID: number;
};
const CreateAnnouncement: FC<IProps> = ({ courseID, assignmentID, store }) => {
  return assignmentID > 0 ? (
    <div className="announcement-create-container border mt-4">
      <div className="announcement-create-container__form">
        <Formik
          initialValues={{
            content: '',
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            const { content } = values;
            const {
              assignment: { fetchAllAssignments, fetchSubmissionsOfStudent, submitAssignment },
            } = store;

            const success = await submitAssignment({ assignmentID, content });
            if (success) {
              await fetchAllAssignments(courseID);
              await fetchSubmissionsOfStudent(Number(store.user.user.id));
              console.log('submitted');
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
                <p className="align-self-start mb-4">Submit your work</p>
                <Box width="100%" mb={2}>
                  <TextField
                    id="content"
                    name="content"
                    label="Content"
                    variant="outlined"
                    onChange={handleChange('content')}
                    multiline
                    fullWidth
                    required
                  />
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="form__error text-danger"
                  />
                </Box>
              </div>

              <div
                className={`${
                  !values.content ? 'd-none' : 'button-container d-flex justify-content-end'
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
