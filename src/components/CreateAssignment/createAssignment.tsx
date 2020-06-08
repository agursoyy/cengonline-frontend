import React, { FC, useEffect, useRef } from 'react';
import './createAssignment.scss';
import { observer, inject } from 'mobx-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Store from '../../store';
import M from 'materialize-css';

const formSchema = Yup.object().shape({
  description: Yup.string().required('Required'),
  title: Yup.string().required('Required'),
  dueDate: Yup.date().min(new Date(), 'Invalid date').required('Required'),
});

type IProps = {
  store?: Store;
  courseID: number;
};
const CreateAssignment: FC<IProps> = ({ courseID, store }) => {
  let datepickerRef = useRef();

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    M.Datepicker.init(datepickerRef.current, {
      format: 'dd.mm.yyyy',
      yearRange: [currentYear, currentYear + 1],
      defaultDate: currentDate,
      container: document.body,
    });
  }, []);

  return courseID > 0 ? (
    <div className="assignment-create-container border">
      <div className="assignment-create-container__form">
        <Formik
          initialValues={{
            description: '',
            title: '',
            dueDate: new Date(),
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            const { description, title, dueDate } = values;
            const {
              assignment: { createAssignment },
            } = store;

            const success = await createAssignment({ courseID, title, description, dueDate });
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
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form noValidate>
              <div className="form-group description">
                <Field
                  name="title"
                  type="text"
                  as="input"
                  className="materialize-input"
                  aria-describedby="emailHelp"
                  placeholder="Title of assignment"
                  required
                />
                <Field
                  name="description"
                  type="text"
                  as="textarea"
                  rows={4}
                  className="materialize-textarea"
                  aria-describedby="emailHelp"
                  placeholder="Description of assignment"
                  required
                />
                <input
                  ref={datepickerRef}
                  type="text"
                  className="datepicker "
                  placeholder="Due date"
                  required
                />
              </div>
              <ErrorMessage name="error" component="div" className="form__error text-danger" />

              <div
                className={`${
                  !values.description ? 'd-none' : 'button-container d-flex justify-content-end'
                } `}
              >
                <button
                  className="btn btn-small transparent waves-effect text-dark mr-2 cancel-btn"
                  onClick={() => {
                    setFieldValue('description', '');
                    setFieldValue('title', '');
                    setFieldValue('dueDate', null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-small waves-effect submit-btn"
                  disabled={isSubmitting}
                >
                  Share <i className="material-icons right">send</i>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  ) : null;
};

export default inject('store')(observer(CreateAssignment));
