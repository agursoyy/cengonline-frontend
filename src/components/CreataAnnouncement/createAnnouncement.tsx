import React, { FC } from 'react';
import './createAnnouncement.scss';
import { observer, inject } from 'mobx-react';
import Avatar from '../../static/icons/avatar.png';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Store from '../../store';
import login from '../../pages/authentication/login';

const formSchema = Yup.object().shape({
  description: Yup.string().required('Required'),
});

type IProps = {
  store?: Store;
  courseID: number;
};
const CreateAnnouncement: FC<IProps> = ({ courseID, store }) => {
  return courseID > 0 ? (
    <div className="announcement-create-container border">
      <div className="announcement-create-container__form">
        <Formik
          initialValues={{
            description: '',
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            console.log('values', values);
            const { description } = values;
            const {
              announcement: { createAnnouncement },
            } = store;

            const success = await createAnnouncement({ courseID, description });
            if (success) {
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
                  name="description"
                  type="text"
                  as="textarea"
                  rows={4}
                  className="materialize-textarea"
                  aria-describedby="emailHelp"
                  placeholder="Make an announcement..."
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

export default inject('store')(observer(CreateAnnouncement));
