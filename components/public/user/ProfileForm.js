import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Row, Card, CardBody, CardTitle, Col, Alert } from 'reactstrap';
import { useRouter } from 'next/router';

const createConsumerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  givenName: Yup.string().required('First name is required.'),
  familyName: Yup.string().required('Last name is required.'),
  email: Yup.string().email().required('Email address is required.'),
  street: Yup.string().max(256, 'Maximum of 256 characters'),
  city: Yup.string()
    .max(128, 'Maximum of 128 characters')
    .when('street', {
      is: (street) => street && street.length > 0,
      then: Yup.string().required('City is required')
    }),
  country: Yup.string()
    .max(128, 'Maximum of 128 characters')
    .when('street', {
      is: (street) => street && street.length > 0,
      then: Yup.string().required('Country is required')
    }),
  postalCode: Yup.string()
    .max(64, 'Maximum of 64 characters')
    .when('street', {
      is: (street) => street && street.length > 0,
      then: Yup.string().required('Postal Code is required')
    }),
  state: Yup.string()
    .max(128, 'Maximum of 128 characters')
    .when('street', {
      is: (street) => street && street.length > 0,
      then: Yup.string().required('State is required')
    }),
  phoneNumber: Yup.string().matches(/\+?(\d|\()[\d-() ]*\d/)
});

export default function ProfileForm({ session, user, logs, setLogs }) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);
  const [setIsUpdating] = useState(false);
  const { data } = user;
  const { email, familyName, givenName, username, address, phoneNumber } = data;
  let userNameSplit = username.split('@');
  userNameSplit.shift();
  userNameSplit = userNameSplit.join('');
  let initialValues = {
    fullUsername: username,
    givenName,
    familyName,
    email: email,
    username: userNameSplit,
    street: address.street ? address.street : '',
    city: address.city ? address.city : '',
    state: address.state ? address.state : '',
    postalCode: address.postalCode ? address.postalCode : '',
    country: address.country ? address.country : '',
    phoneNumber: phoneNumber ?? ''
  };
  const handleSubmit = async (values) => {
    setIsUpdating(true);
    let data = {};
    for (const key in values) {
      // Remove empty fields.
      if (values[key] !== '') {
        data[key] = values[key];
      }
    }
    data['username'] = data['fullUsername'];
    delete data['fullUsername'];
    data['fullName'] = `${data['givenName']} ${data['familyName']}`;
    data['status'] = 'ACTIVE';
    fetch('/api/user', {
      method: 'PUT',
      headers: {
        Authorization: 'AccessToken ' + session.user.token
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((data) => {
        // This is always failing.
        setIsUpdating(false);
        if (data.response.status !== 200) {
          setShowAlert({
            status: data.response.status,
            message: `Uhoh, we've hit an error. Please try again later.`
          });
        } else {
          setShowAlert({
            status: 200,
            message: 'Successfully updated your profile.'
          });
        }
        const newLogs = logs.concat(data.logs);
        setLogs(newLogs);
        setVisible(true);
        updateUserSession();
      });
  };

  const updateUserSession = () => {
    signIn('update-session', {
      json: true,
      token: session.user.token,
      disableCallback: true
    }).then(async () => {
      router.reload();
    });
  };
  return (
    <Formik initialValues={initialValues} validationSchema={createConsumerSchema} onSubmit={handleSubmit}>
      {(formik) => {
        const { errors, touched} = formik;
        return (
          <Form>
            <Alert toggle={onDismiss} isOpen={visible} className="my-4" color={showAlert.status === 200 ? 'success' : 'danger'}>
              {showAlert.message}
            </Alert>
            <Row>
              <Col>
                <h4 className="mb-2">My Profile</h4>
              </Col>
            {
              /*
              TODO: Fix Update Profile functionality              
              <Col>
                <div className="form-group float-right">
                  <Button color="primary" type="submit" className={`${!(dirty && isValid) ? 'disabled' : ''}`} disabled={!(dirty && isValid)}>
                    {isUpdating ? <Spinner color="light" size="sm" /> : <span>Update Profile</span>}
                  </Button>
                </div>
              </Col>
              */
            }
            </Row>

            <Row>
              <Col>
                <Card className="mb-2">
                  <CardBody>
                    <Row>
                      <Col sm="6">
                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <Field name="username" id="username" className={`${errors.username && touched.username ? 'is-invalid' : null} form-control disabled`} disabled />
                          <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <div className="form-group">
                          <label htmlFor="givenName">First Name*</label>
                          <Field name="givenName" id="givenName" className={`${errors.givenName && touched.givenName ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="givenName" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="form-group">
                          <label htmlFor="familyName">Last Name*</label>
                          <Field name="familyName" id="familyName" className={`${errors.familyName && touched.familyName ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="familyName" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Contact</CardTitle>
                    <Row>
                      <Col sm="6">
                        <div className="form-group">
                          <label htmlFor="email">Email*</label>
                          <Field name="email" id="email" className={`${errors.email && touched.email ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="form-group">
                          <label htmlFor="phoneNumber">Phone Number</label>
                          <Field name="phoneNumber" id="phoneNumber" className={`${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="12">
                        <div className="form-group">
                          <label htmlFor="street">Street</label>
                          <Field name="street" id="street" className={`${errors.street && touched.street ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="street" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="4">
                        <div className="form-group">
                          <label htmlFor="city">City</label>
                          <Field name="city" id="city" className={`${errors.city && touched.city ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="city" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                      <Col sm="2">
                        <div className="form-group ">
                          <label htmlFor="state">State</label>
                          <Field name="state" id="state" className={`${errors.state && touched.state ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="state" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                      <Col sm="3">
                        <div className="form-group ">
                          <label htmlFor="postalCode">Postal Code</label>
                          <Field name="postalCode" id="postalCode" className={`${errors.postalCode && touched.postalCode ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="postalCode" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                      <Col sm="3">
                        <div className="form-group ">
                          <label htmlFor="country">Country</label>
                          <Field name="country" id="country" className={`${errors.country && touched.country ? 'is-invalid' : null} form-control`} disabled />
                          <ErrorMessage name="country" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
}
