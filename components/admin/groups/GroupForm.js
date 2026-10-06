import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Alert, Row, Col, Card, CardBody } from 'reactstrap';
import generateGUID from '~/lib/generateGUID';
import useGroup from '~/lib/swr/useGroup';

const init = {
  version: 1,
  tag: '',
  status: '',
  title: '',
  groupId: ''
};

const createGroupSchema = Yup.object().shape({
  version: Yup.number().required('Version is required when udpating a group'),
  tag: Yup.string(),
  status: Yup.mixed().required('Status is required').oneOf(['INACTIVE', 'ACTIVE', 'DISCONTINUED', 'SEASONAL', 'TO_DISCONTINUE', 'UNAUTHORIZED']),
  title: Yup.string().required('Title is required'),
  groupId: Yup.string().required('Group id is required')
});

const GroupForm = ({ id }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [visible, setVisible] = useState(false);
  const onDismiss = () => setVisible(false);

  const [initialValues, setInitialValues] = useState(init);
  let { data, isLoading, isError } = useGroup(id);
  if (id && !isLoading && !isError && initialValues.title === '') {
    let group = data.response.data;
    let newValues = {
      version: group.version + 1,
      title: group.title.values[0].value,
      status: group.status,
      groupId: group.groupId.groupCode,
      tag: group.tag
    };
    setInitialValues(newValues);
  }

  const handleSubmit = async (values) => {
    // update
    let data = {};
    for (const key in values) {
      // Remove empty fields.
      if (values[key] !== '') {
        data[key] = values[key];
      }
    }
    let groupId = data['groupId'];
    data['groupId'] = {
      groupCode: groupId
    };
    let title = data['title'];
    // Doesn't support multi-lang right now.
    data['title'] = {
      values: [
        {
          locale: 'en-US',
          value: title
        }
      ]
    };
    fetch(`/api/groups`, { method: 'POST', body: JSON.stringify(data) })
        .then((response) => {
          if (response.status !== 204) {
            setShowAlert({
              status: response.status,
              message: response.data.message
            });
          } else {
            setShowAlert({
              status: 200,
              message: 'Group successfully created'
            });
          }
          setVisible(true);
        });
  };

  return (
    <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={createGroupSchema} onSubmit={handleSubmit}>
      {(formik) => {
        const { errors, touched, isValid, dirty, setFieldValue } = formik;
        return (
          <Form className="my-4">
            <Alert toggle={onDismiss} isOpen={visible} className="my-4" color={showAlert.status == 200 ? 'success' : 'danger'}>
              {showAlert.message}
            </Alert>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">{id ? 'Edit' : 'Create'} Group</h1>
              <div className="form-group float-right">
                <button type="submit" className={`${!(dirty && isValid) ? 'disabled' : ''} btn btn-primary`} disabled={`${!(dirty && isValid) ? 'disabled' : ''}`}>
                  {' '}
                  {id ? '+ Update' : '+ Create'} Group
                </button>
              </div>
            </div>
            <Row>
              <Col md="8">
                <Card>
                  <CardBody>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="title">Title*</label>
                        <Field name="title" id="title" className={`${errors.title && touched.title ? 'is-invalid' : null} form-control`} />
                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="groupId">Group Id</label>
                      <Field name="groupId" id="groupId" className={`${errors.groupId && touched.groupId ? 'is-invalid' : null} form-control`} disabled={id ? 'disabled' : ''} />
                      <ErrorMessage name="groupId" component="div" className="invalid-feedback" />
                      <Button onClick={() => setFieldValue('groupId', generateGUID())} color="link" className="m-0 p-0">
                        Generate
                      </Button>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tag">Tag</label>
                      <Field name="tag" id="tag" className={`${errors.tag && touched.tag ? 'is-invalid' : null} form-control`} />
                      <ErrorMessage name="tag" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="version">Version</label>
                      <Field name="version" id="version" className={`${errors.version && touched.version ? 'is-invalid' : null} form-control`} />
                      <ErrorMessage name="version" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <Field as="select" name="status" className={`${errors.status && touched.status ? 'is-invalid' : null} form-control`}>
                        <option value="" label="--" />
                        <option value="ACTIVE" label="ACTIVE" />
                        <option value="INACTIVE" label="INACTIVE" />
                        <option value="DISCONTINUED" label="DISCONTINUED" />
                        <option value="SEASONAL" label="SEASONAL" />
                        <option value="TO_DISCONTINUE" label="TO_DISCONTINUE" />
                        <option value="UNAUTHORIZED" label="UNAUTHORIZED" />
                      </Field>
                      <ErrorMessage name="status" component="div" className="invalid-feedback" />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default GroupForm;
