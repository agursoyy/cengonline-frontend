import React, { FC } from 'react';
import './authentication.scss';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Too Short')
});

const Login = () => {
  return (
    <div className="auth-container d-flex align-items-center">
      < div className="container" >
        <div className="row d-flex justify-content-center">
          <div className="col-md-5 p-0">
            <div className="auth-container__box">
              <h1 className="auth-container__box__header">Sign in to continue to Cengonline</h1>
              <Formik
                initialValues={{
                  password: '',
                  email: '',
                }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                  console.log(values);
                  /*const result = await login({ email: values.email, password: values.password });
                  const { auth } = result;
                  if (auth) {
                    console.log('LOGIN SUCCEEDED');
                    Router.pushRoute('home');
                  }
                  else {
                    const { errors } = result;
                    handleServerErrors(errors, setFieldError);
                  }
                  setSubmitting(false); */
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
