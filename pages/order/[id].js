import Header from '~/components/public/Header';
import Head from 'next/head';
import Footer from '~/components/public/Footer';
import { Col, Card, CardBody, CardTitle, Container, Spinner, Progress, Row } from 'reactstrap';
import CheckoutList from '~/components/public/checkout/CheckoutList';
import useOrder from '~/lib/swr/useOrder';
import { getCategoryNodesForMenu } from '~/lib/category';

export default function Order({ id, categories }) {
  const { data, isLoading, isError } = useOrder(id);
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
    <div className="d-flex flex-column main-container">
      <Head>
        <title>MART | Order</title>
      </Head>
      <Header logs={data ? data.logs : []} categories={categories} />
      <Container className="my-4 flex-grow-1">
        {isLoading && (
          <div className="d-flex justify-content-center h-100">
            <Spinner color="dark" />
          </div>
        )}
        {isError && <p>Error</p>}
        {!isLoading && !isError && data && data.order && (
          <Card>
            <CardBody className="border-bottom pb-0">
              <CardTitle>
                <strong>Order ID: {data.order.data.id}</strong>
              </CardTitle>
            </CardBody>
            <CardBody className="row justify-content-md-center">
              <Col sm="12" md="9">
                <h5 className="text-center">{convertStatusText(data.order.data.status)}</h5>
                <Progress
                  barAriaLabelledBy={convertStatusText(data.order.data.status)}
                  value={`${data.order.data.status === 'OrderPlaced' ? '1' : data.order.data.status == 'ReceivedForFulfillment' ? '2' : data.order.data.status == 'InFulfillment' ? '3' : '4'}`}
                  max="4"
                />
              </Col>
            </CardBody>
            <CardBody className="border-bottom">
              <Row className="justify-content-md-center">
                <Col md="3">
                  <strong>Shipping</strong>
                  <p className="mb-0">{data.order.data.customer.name}</p>
                  <p className="mb-0">{data.order.data.fulfillment.address.line1}</p>
                  <p className="mb-0">
                    {data.order.data.fulfillment.address.city} {data.order.data.fulfillment.address.state} {data.order.data.fulfillment.address.postalCode}
                  </p>
                </Col>
                <Col md="3">
                  <strong>Store</strong>
                  <p className="mb-0">{data.order.data.owner}</p>
                  <p className="mb-0">{data.order.data.channel === 'Web' ? 'Online Order' : data.order.data.channel}</p>
                </Col>
                <Col md="3">
                  <strong>Total</strong>
                  <p className="mb-0">${data.order.data.totals[0].value}</p>
                </Col>
              </Row>
            </CardBody>
            <CheckoutList cartItems={data.order.data.orderLines} showTitle={true} />
          </Card>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(context) {
  const response = await getCategoryNodesForMenu();
  const { categories, logs } = JSON.parse(JSON.stringify(response));
  return {
    props: {
      id: context.params.id,
      categories,
      logs
    }
  };
}
