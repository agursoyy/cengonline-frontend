import React, { FC } from 'react';
import Store from '../../store';
import './attendClass.scss';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router';

interface IProps {
  store?: Store;
  closeModal: () => void;
}
const formSchema = Yup.object().shape({
  code: Yup.string().required().min(1)
});

const AttendClass: FC<IProps> = (props) => {
  const { store } = props;
  const history = useHistory();

  return (
    <div className="attend-class__container">
      <div className="title">
        Attend to Class
      </div>
      <div className="subtitle">
        Enter the code you have got from your teacher
      </div>
      <Formik
        initialValues={{
          code: '',
          errorMsg: '',
          successMsg: ''
        }}
        validationSchema={formSchema}
        onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
          const { code } = values;
          console.log(code);
          const { user: { attendCourse } } = store;
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
        {({ errors, touched, values, setFieldValue, isSubmitting, isValid, dirty }) => (
          <Form noValidate>
            <div className="form-group description">
              <Field
                name="code"
                type="text"
                className="form-control"
                placeholder="Code"
                required
              />
            </div>
            <ErrorMessage name="errorMsg" component="div" className="form--error " />
            <ErrorMessage name="successMsg" component="div" className="form--success " />

            <div className={'button-container d-flex justify-content-end'}>
              <button
                type="button"
                className="btn btn-small transparent waves-effect text-dark mr-2 cancel-btn"
                onClick={() => {
                  props.closeModal();
                }}
              >
                Cancel
                </button>
              <button
                type="submit"
                className="btn btn-small waves-effect submit-btn"
                disabled={!(dirty && isValid)}
              >
                Attend <i className="material-icons right">send</i>
              </button>

            </div>
          </Form>
        )}
      </Formik>
    </div >
  );
};

export default inject('store')(observer(AttendClass));