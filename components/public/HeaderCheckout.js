import { Container, Row, Col } from 'reactstrap';

export default function HeaderCheckout() {
  return (
    <div className="bg-white">
      <header className="section-header shadow-sm">
        <section className="header-main border-bottom py-3">
          <Container>
            <Row className="align-items-center">
              <Col sm="4" md="3">
                <a href="/" className="logo-text">
                  MART
                </a>
              </Col>
            </Row>
          </Container>
        </section>
      </header>
    </div>
  );
}
