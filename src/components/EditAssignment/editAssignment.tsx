import React, { FC } from 'react';
import Store from '../../store';
import { observer, inject } from 'mobx-react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

import DateFnsUtils from '@date-io/date-fns';

interface IProps {
  store?: Store;
  id: number;
  titleP: string;
  descriptionP: string;
  dueDateP: any;
  closeModal: () => void;
}
const formSchema = Yup.object().shape({
  title: Yup.string().trim().required('Required'),
  description: Yup.string().trim().required('Required'),
  dueDate: Yup.date().min(new Date(), 'Invalid date').required('Required'),
});

const EditAssignment: FC<IProps> = ({ id, titleP, descriptionP, dueDateP, closeModal, store }) => {
  const { id: courseId } = useParams();

  const split = dueDateP.split(' ');
  const dueDateSplit = split[0].split('.');
  const dueTimeSplit = split[1].split(':');
  const due = new Date(
    Number(dueDateSplit[2]),
    Number(dueDateSplit[1]) - 1,
    Number(dueDateSplit[0]),
    Number(dueTimeSplit[0]),
    Number(dueTimeSplit[1]),
  );

  const dateLimit = new Date();
  dateLimit.setFullYear(dateLimit.getFullYear() + 2);

  return (
    <div className="modal__container">
      <div className="title">Edit Assignment</div>
      <Formik
        initialValues={{
          title: titleP,
          description: descriptionP,
          dueDate: due,
          dueTime: due,
          errorMsg: '',
          successMsg: '',
        }}
        validationSchema={formSchema}
        onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
          const { title, description, dueDate, dueTime } = values;
          const {
            assignment: { updateAssignment },
          } = store;
          const success = await updateAssignment({
            courseId: courseId,
            assignmentId: id,
            assignmentDescription: description,
            assignmentTitle: title,
            assignmentDueDate: dueDate,
            assignmentDueTime: dueTime,
          });
          if (success) {
            setFieldError('successMsg', 'Assignment has been updated');
            setTimeout(() => {
              closeModal();
              setSubmitting(false);
            }, 750);
          } else {
            setFieldError('errorMsg', 'Something has gone wrong');
            setSubmitting(false);
          }
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
            <div className="form-group announcement-edit">
              <Box width="100%" mb={2}>
                <TextField
                  id="title"
                  name="title"
                  label="Title"
                  variant="outlined"
                  value={values.title}
                  onChange={handleChange('title')}
                  fullWidth
                  required
                />
                <ErrorMessage name="title" component="div" className="form__error text-danger" />
              </Box>
              <Box width="100%" mb={2}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  variant="outlined"
                  value={values.description}
                  onChange={handleChange('description')}
                  multiline
                  rowsMax={4}
                  fullWidth
                  required
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="form__error text-danger"
                />
              </Box>
              <Box width="100%" mb={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="dueDate"
                    name="dueDate"
                    value={values.dueDate}
                    disablePast
                    label="Due Date"
                    inputVariant="outlined"
                    format="dd.MM.yyyy"
                    maxDate={dateLimit}
                    error={false}
                    helperText=""
                    onChange={(value) => setFieldValue('dueDate', value)}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
                <ErrorMessage name="dueDate" component="div" className="form__error text-danger" />
              </Box>
              <Box width="100%" mb={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    id="dueTime"
                    name="dueTime"
                    value={values.dueTime}
                    label="Due Time"
                    inputVariant="outlined"
                    ampm={false}
                    onChange={(value) => setFieldValue('dueTime', value)}
                    error={false}
                    helperText=""
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </div>

            <ErrorMessage name="errorMsg" component="div" className="form--error" />
            <ErrorMessage name="successMsg" component="div" className="form--success " />
            <div
              className={`${
                !values.description || !values.title
                  ? 'd-none'
                  : 'button-container d-flex justify-content-end'
              } `}
            >
              <Button
                variant="contained"
                onClick={() => {
                  closeModal();
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

export default inject('store')(observer(EditAssignment));
