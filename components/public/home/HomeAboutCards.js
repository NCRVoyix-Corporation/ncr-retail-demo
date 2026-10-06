import { Card, CardBody, CardText, CardTitle, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faCode, faKey } from '@fortawesome/free-solid-svg-icons';

const HomeAboutCards = () => {
  return (
    <Row className="mb-4">
      <Col sm={12} md={4} className="mb-2 mb-md-0 ">
        <Card className="d-flex align-items-center justify-content-center flex-row pl-4 pl-md-0 pl-lg-4 py-2">
          <FontAwesomeIcon icon={faProjectDiagram} size="2x" className="text-dark d-md-none d-lg-flex" />
          <CardBody>
            <CardTitle tag="h2" className="h5 font-weight-bolder text-dark">
              Built with NCR Voyix APIs
            </CardTitle>
            <CardText className="text-dark">Integrated with Catalog, Sites, Order, Selling, Provisioning, Security, and more.</CardText>
          </CardBody>
        </Card>
      </Col>
      <Col sm={12} md={4} className="mb-2 mb-md-0 ">
        <Card className="d-flex align-items-center justify-content-center flex-row pl-4 pl-md-0 pl-lg-4 py-2">
          <FontAwesomeIcon icon={faCode} size="2x" className="text-dark d-md-none d-lg-flex" />
          <CardBody>
            <CardTitle tag="h2" className="h5 font-weight-bolder text-dark">
              Open Sourced
            </CardTitle>
            <CardText className="text-dark">View the code, clone the repository, and get started on your own</CardText>
          </CardBody>
        </Card>
      </Col>
      <Col sm={12} md={4} className="mb-2 mb-md-0 ">
        <Card className="d-flex align-items-center justify-content-center flex-row pl-4 pl-md-0 pl-lg-4 py-2">
          <FontAwesomeIcon icon={faKey} size="3x" className="text-dark d-md-none d-lg-flex" />
          <CardBody>
            <CardTitle tag="h2" className="h5 font-weight-bolder text-dark">
              Admin Interface
            </CardTitle>
            <CardText className="text-dark">Deepen your understanding of NCR Voyix APIs by creating sites, new catalog items, and more.</CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default HomeAboutCards;
