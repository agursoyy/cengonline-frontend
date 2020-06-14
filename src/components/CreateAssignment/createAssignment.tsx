import React, { FC, useEffect, useRef } from 'react';
import './createAssignment.scss';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Store from '../../store';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Typography, Button, Box, TextField } from '@material-ui/core';

const formSchema = Yup.object().shape({
  description: Yup.string().trim().required('Required'),
  title: Yup.string().trim().required('Required'),
  dueDate: Yup.date().min(new Date(), 'Invalid date').required('Required'),
});

type IProps = {
  store?: Store;
  courseID: number;
};
const CreateAssignment: FC<IProps> = ({ courseID, store }) => {
  const dateLimit = new Date();
  dateLimit.setFullYear(dateLimit.getFullYear() + 2);

  return courseID > 0 ? (
    <div className="assignment-create-container border">
      <div className="assignment-create-container__form">
        <Formik
          initialValues={{
            description: '',
            title: '',
            dueDate: new Date(),
            dueTime: new Date(),
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            const { description, title, dueDate, dueTime } = values;
            const {
              assignment: { createAssignment },
            } = store;

            const success = await createAssignment({
              courseID,
              title,
              description,
              dueDate,
              dueTime,
            });
            if (success) {
              await store!.assignment.fetchAllAssignments(courseID);
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
                  Publish a new assignment
                </Typography>
                <Box width="100%" mb={2}>
                  <TextField
                    id="title"
                    name="title"
                    label="Title"
                    variant="outlined"
                    onChange={handleChange('title')}
                    fullWidth
                    required
                  />
                  <ErrorMessage name="title" component="div" className="form__error text-danger" />
                </Box>
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
                <Box width="100%" mb={2}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      id="dueDate"
                      name="dueDate"
                      value={values.dueDate}
                      disablePast
                      maxDate={dateLimit}
                      label="Due Date"
                      inputVariant="outlined"
                      format="dd.MM.yyyy"
                      error={false}
                      helperText=""
                      onChange={(value) => setFieldValue('dueDate', value)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="form__error text-danger"
                  />
                </Box>
                <Box width="100%" mb={2}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      id="dueTime"
                      name="dueTime"
                      value={values.dueTime}
                      label="Due Time"
                      inputVariant="outlined"
                      ampm={false}
                      onChange={(value) => setFieldValue('dueTime', value)}
                      error={false}
                      helperText=""
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Box>
              </div>

              <div
                className={`${
                  !values.description || !values.title
                    ? 'd-none'
                    : 'button-container d-flex justify-content-end'
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

export default inject('store')(observer(CreateAssignment));
