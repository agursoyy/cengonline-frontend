import React, { FC } from 'react';
import Store from '../../store';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Router, useHistory } from 'react-router';

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
        {({ errors, touched, values, setFieldValue, isSubmitting, dirty, isValid }) => (
          <Form noValidate>
            <div className="form-group description">
              <Field
                name="title"
                type="text"
                className="form-control"
                placeholder="Course Title"
                required
              />
            </div>
            <ErrorMessage name="title" component="div" className="form--error" />
            <div className="form-group">
              <Field
                name="term"
                component="select"
                placeholder="Favorite Color"
                className="browser-default"
              >
                <option value="" disabled defaultValue={''}>
                  Select course term
                </option>
                <option value="Spring">Spring</option>
                <option value="Fall">Fall</option>
              </Field>
            </div>

            <ErrorMessage name="errorMsg" component="div" className="form--error" />
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
                Submit <i className="material-icons right">send</i>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default inject('store')(observer(CreateClass));
