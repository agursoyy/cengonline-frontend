import React, { FC } from 'react';
import Store from '../../store';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router';

import { Typography, Button, Box, TextField } from '@material-ui/core';

interface IProps {
  store?: Store;
  closeModal: () => void;
}
const formSchema = Yup.object().shape({
  code: Yup.string().required().min(1),
});

const AttendClass: FC<IProps> = (props) => {
  const { store } = props;
  const history = useHistory();

  return (
    <div className="modal__container">
      <div className="title">Attend to Class</div>
      <div className="subtitle">Enter the code you have got from your teacher</div>
      <Formik
        initialValues={{
          code: '',
          errorMsg: '',
          successMsg: '',
        }}
        validationSchema={formSchema}
        onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
          const { code } = values;
          console.log(code);
          const {
            user: { attendCourse },
          } = store;
          const { success, courseId, message } = await attendCourse(code);
          if (success) {
            setFieldError('successMsg', message);
            setTimeout(() => {
              resetForm();
              props.closeModal();
              history.push(`/course/${courseId}`);
            }, 750);
          } else {
            console.log(message);
            setFieldError('errorMsg', message);
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
          isValid,
          dirty,
        }) => (
            <Form noValidate>
              <div className="form-group description">
                <Box width="100%" mb={2}>
                  <TextField
                    id="code"
                    name="code"
                    label="Course Code"
                    variant="filled"
                    type="number"
                    onChange={handleChange('code')}
                    fullWidth
                    required
                  />
                  <ErrorMessage name="code" component="div" className="form__error text-danger" />
                </Box>
              </div>
              <ErrorMessage name="errorMsg" component="div" className="form--error " />
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
                  Attend
              </Button>
              </div>
            </Form>
          )}
      </Formik>
    </div>
  );
};

export default inject('store')(observer(AttendClass));
