import React, { FC } from 'react';
import Store from '../../store';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Router, useHistory } from 'react-router';

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

interface IProps {
  store?: Store;
  closeModal: () => void;
}
const formSchema = Yup.object().shape({
  title: Yup.string().required('required'),
  term: Yup.string().required(),
});

const CreateClass: FC<IProps> = (props) => {
  const { store } = props;
  const history = useHistory();
  return (
    <div className="modal__container">
      <div className="title">Create Class</div>
      <Formik
        initialValues={{
          title: '',
          term: '',
          errorMsg: '',
          successMsg: '',
        }}
        validationSchema={formSchema}
        onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
          console.log(values);
          const { title, term } = values;
          const {
            course: { addCourse },
          } = store;

          const { success, courseId } = await addCourse({ title, term });
          if (success) {
            setFieldError('successMsg', 'Course created successfully and redirecting');
            setTimeout(() => {
              props.closeModal();
              history.push(`/course/${courseId}`);
            }, 750);
          } else {
            setFieldError('errorMsg', 'Something has gone wrong');
          }
          setSubmitting(false);
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
            <div className="form-group description">
              <Box width="100%" mb={2}>
                <TextField
                  id="title"
                  name="title"
                  label="Course Title"
                  variant="filled"
                  onChange={handleChange('title')}
                  fullWidth
                  required
                />
                <ErrorMessage name="title" component="div" className="form__error text-danger" />
              </Box>
            </div>
            <div className="form-group">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Course Term</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="term"
                  onChange={handleChange('term')}
                >
                  <MenuItem value={'Spring'}>Spring</MenuItem>
                  <MenuItem value={'Fall'}>Fall</MenuItem>
                </Select>
              </FormControl>
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

export default inject('store')(observer(CreateClass));
