import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getSession, signIn } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { Row, Card, CardBody, CardTitle, Col, Button, Spinner, CardFooter } from 'reactstrap';

const initialValues = {
  username: '',
  password: ''
};

const createConsumerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required.')
});

export default function Login({ query = false }) {
  const router = useRouter();
  const [loginRequest, setLoginRequest] = useState(false);

  const handleSubmit = async (values) => {
    setLoginRequest(true);
    signIn('login', {
      json: true,
      username: values.username,
      password: values.password,
      redirect: false
    }).then(async () => {
      let status = await getSession();
      setLoginRequest(false);
      if (status == null) {
        toast.error('Invalid Login. Please try again');
      } else {
        router.push({
          pathname: query && query.redirect ? query.redirect : '/'
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
                    <CardTitle tag="h4">Login</CardTitle>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="username">
                            Username* <small>[tester00]</small>
                          </label>
                          <Field name="username" id="username" className={`${errors.username && touched.username ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="password">
                            Password* <small>[testing!12]</small>
                          </label>
                          <Field name="password" type="password" id="password" className={`${errors.password && touched.password ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button block color="primary" type="submit" className={`${!(dirty && isValid) ? 'disabled' : ''}`} disabled={!(dirty && isValid)}>
                          {loginRequest ? <Spinner color="light" size="sm" /> : <span>Login</span>}
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter className="bg">
                    <p className="text-muted mb-0">
                      Need have an account?{' '}
                      <a href="/auth/register" className="link p-0 m-0">
                        Register
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
