import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

import { Row, Card, CardBody, CardTitle, Col, Button, Spinner, CardFooter } from 'reactstrap';

const initialValues = {
  firstName: '',
  lastName: '',
  emailAddress: '',
  password: ''
};

const createConsumerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  firstName: Yup.string().required('First name is required.'),
  lastName: Yup.string().required('Last name is required.'),
  emailAddress: Yup.string().email().required('Email address is required.'),
  password: Yup.string().required('Password is required.')
});

export default function Register() {
  const router = useRouter();
  const [registering, setRegistering] = useState(false);
  const handleSubmit = async (values) => {
    setRegistering(true);
    const { username, emailAddress, firstName, lastName, password } = values;
    signIn('register', {
      username,
      emailAddress,
      firstName,
      lastName,
      password,
      redirect: false
    }).then(async (data) => {
      let status = await getSession();
      setRegistering(false);
      if (status === null) {
        toast.error(data.error);
      } else {
        router.push({
          pathname: '/'
        });
      }
    });
  };
  return (
    <Formik initialValues={initialValues} validationSchema={createConsumerSchema} onSubmit={handleSubmit}>
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik;
        return (
          <Form>
            <Toaster />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <CardTitle tag="h4">Sign Up</CardTitle>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="firstName">First Name*</label>
                          <Field name="firstName" id="firstName" className={`${errors.firstName && touched.firstName ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name*</label>
                          <Field name="lastName" id="lastName" className={`${errors.lastName && touched.lastName ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="username">Username*</label>
                          <Field name="username" id="username" className={`${errors.username && touched.username ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="emailAddress">Email*</label>
                          <Field name="emailAddress" id="emailAddress" className={`${errors.emailAddress && touched.emailAddress ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="emailAddress" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="password">Password*</label>
                          <Field name="password" type="password" id="password" className={`${errors.password && touched.password ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button block color="primary" type="submit" className={`${!(dirty && isValid) ? 'disabled' : ''}`} disabled={!(dirty && isValid)}>
                          {registering ? <Spinner color="light" size="sm" /> : <span>Sign Up</span>}
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter className="bg">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <a href="/auth/login" className="link p-0 m-0">
                        Login
                      </a>
                    </p>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
}
