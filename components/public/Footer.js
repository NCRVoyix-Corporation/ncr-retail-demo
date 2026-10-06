import Router from 'next/router';
import { useSession } from 'next-auth/react';
import { Row, Col, Container, Button } from 'reactstrap';

const Footer = () => {
  const { data: session, status } = useSession();
  const startDemo = () => {
    localStorage.clear();
    Router.reload(window.location.pathname);
    window.scrollTo(0, 0);
  };
  return (
    <footer className="footer">
      <Container className="py-5 text-white">
        <Row>
          <Col sm="12" md="4">
            <a href="/" className="logo-text">
              MART
            </a>
          </Col>
          <Col sm="12" md="4">
            <h2 className="h6 text-uppercase font-weight-bolder text-light">Resources</h2>
            <ul className="list-unstyled text-small">
              <li>
                <a href="/sites" className="text-white">
                  Find a Store
                </a>
              </li>
              {!status && session && (
                <li>
                  <a href="/user/profile" className="text-white">
                    Manage Account
                  </a>
                </li>
              )}
            </ul>
          </Col>
          <Col sm="12" md="4">
            <h2 className="h6 text-uppercase font-weight-bolder text-light">Help</h2>
            <ul className="list-unstyled text-small">
              <li>
                <a href="https://developer.ncrvoyix.com/" className="text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/NCR-Corporation/ncr-retail-demo" className="text-white">
                  Github
                </a>
              </li>
              <li>
                <Button color="light" onClick={startDemo} className="text-darker float-right">
                  Start Demo
                </Button>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
