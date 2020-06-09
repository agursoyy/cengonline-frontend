import React, { FC } from 'react';
import Store from '../../store';
import './createClass.scss';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface IProps {
  store?: Store;
  closeModal: () => void;
}
const formSchema = Yup.object().shape({
  title: Yup.string().required('Specify title of the course ').min(2, 'Course must have a recognizable title'),
  term: Yup.string().required('Specify term of the course')
});

const CreateClass: FC<IProps> = (props) => {
  const { store } = props;

  return (
    <div className="create-class__container">
      <h5 className="title">
        Create Class
      </h5>
      <Formik
        initialValues={{
          title: '',
          term: ''
        }}
        validationSchema={formSchema}
        onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
          console.log(values);
          const { title, term } = values;

          if (!term)
            setFieldError('error', 'specify term of the course');
          const {
            course: { addCourse },
          } = store;

          const success = await addCourse({ title, term });
          if (success) {
            alert(`${title} course for ${term} season created successfully.`);
            setFieldError('success', `${title} course for ${term} season created successfully.`);
            resetForm();
            props.closeModal();
          } else {
            alert('error something went wrong.');
          }
          setSubmitting(false);
          console.log('SUBMITTEd');
        }}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form noValidate>
            <div className="form-group description">
              <Field
                name="title"
                type="text"
                className="form-control"
                placeholder="Course Title"
                required
              />
              <ErrorMessage name="title" component="div" className="form__error " />
            </div>
            <div className="form-group">
              <Field name="term" component="select" placeholder="Favorite Color" className="browser-default" >
                <option value="" disabled defaultValue={''}>Select course term</option>
                <option value="Spring">Spring</option>
                <option value="Autumn">Autumn</option>
              </Field>
              <ErrorMessage name="term" component="div" className="form__error " />
            </div>

            <ErrorMessage name="error" component="div" className="form__error " />
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
                disabled={isSubmitting}
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