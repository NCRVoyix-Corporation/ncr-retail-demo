import { Card, CardTitle, CardBody, Col, Row } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';

export default function OrderList({ order }) {
  const convertStatusText = (text) => {
    if (text === 'OrderPlaced') {
      return 'Order Placed';
    }
    if (text === 'ReceivedForFulfillment') {
      return 'Received for Fulfillment';
    }
    if (text == 'InFulfillment') {
      return 'In Fulfillment';
    }
    if (text == 'Finished') {
      return 'Completed';
    }
  };
  return (
    <Card className="mb-2">
      <CardBody className="border-bottom pb-0">
        <CardTitle className="d-flex justify-content-between">
          {order ? (
            <strong>Order ID: {order.id}</strong>
          ) : (
            <span className="w-50">
              <strong>
                Order ID: <Skeleton width="50%" />
              </strong>
            </span>
          )}
          <p className={!order ? 'w-50 text-right' : ''}>Last Updated: {order ? new Date(Date.parse(order.dateUpdated)).toLocaleString() : <Skeleton width="25%" />}</p>
        </CardTitle>
      </CardBody>
      <CardBody>
        <Row>
          <Col md="3">
            <strong>Shipping To:</strong>
            <p className="mb-0">{order ? order.customer.name : <Skeleton />}</p>
            {order ? (
              order.fulfillment && (
                <div>
                  <p className="mb-0">{order.fulfillment.address.line1}</p>
                  <p className="mb-0">
                    {order.fulfillment.address.city} {order.fulfillment.address.state} {order.fulfillment.address.postalCode}
                  </p>
                </div>
              )
            ) : (
              <div>
                <p className="mb-0">
                  <Skeleton /> <Skeleton />
                </p>
              </div>
            )}
          </Col>
          <Col md="3">
            <strong>Total:</strong>
            <p className="mb-0">{order ? `$${order.totals[0].value}` : <Skeleton />}</p>
          </Col>
          <Col md="3">
            <strong>Status:</strong>
            <p className="mb-0">{order ? convertStatusText(order.status) : <Skeleton />}</p>
          </Col>
          <Col md="3">
            {order && (
              <a href={`/order/${order.id}`} className="btn btn-outline-primary">
                View Order
              </a>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
