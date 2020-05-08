import React, { FC, useState, useEffect } from 'react';
import './authentication.scss';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Store from '../../store';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';




const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Too Short')
});

interface IProps {
  store?: Store,
  location?: any
}

interface IPRops {
  card: {
    id: Number,
    title: string
  }
}
const Login: FC<IProps> = ({ store, location }) => {
  const { auth: { login } } = store!;
  const history = useHistory();
  const { state } = location; // which page has been redirected to login
  let from: '/'; // default redirect route after logged in.
  if (state)
    from = state.from;

  return (
    <div className="auth-container d-flex align-items-center">
      < div className="container" >
        <div className="row d-flex justify-content-center">
          <div className="col-md-5 p-0">
            <div className="auth-container__box">
              <h1 className="auth-container__box__header">Sign in to continue to Cengonline</h1>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                  const result = await login({ email: values.email, password: values.password });
                  const { auth } = result;
                  const user = await store?.user.getCurrent();
                  if (auth && user) {
                    console.log('LOGIN SUCCEEDED');
                    window.location.href = '/';
                  }
                  else {
                    const { errors } = result;
                    setFieldError('password', errors.message);
                  }
                  setSubmitting(false);
                }}
              >
                {({ errors, touched, values, isSubmitting }) => (

                  <Form noValidate>
                    <div className="form-group">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <label htmlFor="email">Email</label>
                        <a href="#" className="tip">Forgot Email?</a>
                      </div>
                      <Field name="email" type="email" className="form-control input-text" aria-describedby="emailHelp" placeholder=' '
                        required />
                      <ErrorMessage name="email" component="div" className="form__error text-danger" />
                    </div>
                    <div className="form-group">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <label htmlFor="email">Password</label>
                        <a href="#" className="tip">Forgot Password?</a>
                      </div>
                      <Field name="password" type="password" className="form-control input-text" aria-describedby="passwordHelp" placeholder=' '
                        required />
                      <ErrorMessage name="password" component="div" className="form__error text-danger" />
                    </div>
                    <ErrorMessage name="error" component="div" className="form__error text-danger" />

                    <div className="submit d-flex flex-wrap justify-content-between align-items-center">
                      <Link to="/sign-up" className="tip">Create an account</Link>
                      <button type="submit" className='btn btn-lg blue waves-effect waves-light submit-btn' disabled={isSubmitting}>Login</button>
                    </div>

                  </Form>
                )}
              </Formik>

            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default inject('store')(observer(Login));
