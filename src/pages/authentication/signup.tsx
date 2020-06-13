import React, { FC } from 'react';
import './authentication.scss';
import Store from '../../store';
import { inject, observer } from 'mobx-react';
import { Link, useHistory } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Button } from '@material-ui/core';

const LoginSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  surname: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required').min(6, 'Too Short'),
});

interface IProps {
  store?: Store;
  location?: any;
}

const Signup: FC<IProps> = (props) => {
  const { store } = props;
  const history = useHistory();
  return (
    <div className="auth-container d-flex align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <div className="auth-container__box">
              <h1 className="auth-container__box__header">Sign up to continue to Cengonline</h1>
              <Formik
                initialValues={{
                  name: '',
                  surname: '',
                  password: '',
                  email: '',
                  errorMsg: '',
                  successMsg: '',
                }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                  console.log(values);
                  const {
                    auth: { signup },
                  } = store;
                  const result = await signup({
                    email: values.email,
                    name: values.name,
                    surname: values.surname,
                    password: values.password,
                  });
                  const { success, message } = result;
                  if (success) {
                    setFieldError('successMsg', message);
                    setTimeout(() => {
                      history.push('/sign-in');
                      setSubmitting(false);
                    }, 2000);
                  } else {
                    console.log(result);
                    const { message } = result;
                    setFieldError('errorMsg', message);
                    setSubmitting(false);
                  }
                }}
              >
                {({ errors, touched, values, isSubmitting }) => (
                  <Form noValidate>
                    <div className="form-group">
                      <label htmlFor="name">First Name</label>
                      <Field
                        name="name"
                        type="text"
                        className="form-control input-text"
                        aria-describedby="nameHelp"
                        placeholder=" "
                        required
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="surname">Last Name</label>
                      <Field
                        name="surname"
                        type="email"
                        className="form-control input-text"
                        aria-describedby="surnameHelp"
                        placeholder=" "
                        required
                      />
                      <ErrorMessage
                        name="surname"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div>
                    <div className="form-group">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <label htmlFor="email">Email</label>
                      </div>
                      <Field
                        name="email"
                        type="email"
                        className="form-control input-text"
                        aria-describedby="emailHelp"
                        placeholder=" "
                        required
                      />
                      <ErrorMessage name="email" component="div" className="form__error" />
                    </div>
                    <div className="form-group">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <label htmlFor="email">Password</label>
                      </div>
                      <Field
                        name="password"
                        type="password"
                        className="form-control input-text"
                        aria-describedby="passwordHelp"
                        placeholder=" "
                        required
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div>
                    <ErrorMessage name="errorMsg" component="div" className="form__error" />
                    <ErrorMessage name="successMsg" component="div" className="form__success" />
                    <div className="submit d-flex flex-wrap justify-content-between align-items-center">
                      <Link to="/sign-in" className="tip mb-3">
                        Already have an account?
                      </Link>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Sign up
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Signup));
