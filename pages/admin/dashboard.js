import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCheckCircle, faCircle, faExclamationCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CardTitle, Card, CardBody, Col, Row } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import useDashboard from '~/lib/swr/useDashboard';
import Orders from '~/components/admin/orders/Orders';
import Layout from '~/components/admin/Layout';
import React, {useContext} from 'react';
import {UserStoreContext} from "~/context/userStore";

const Dashboard = () => {
  const { userStore } = useContext(UserStoreContext);
  let { data, isLoading, isError } = useDashboard({ storeID: userStore.id });
  let ordersPlaced = [];
  let ordersReceived = [];
  let ordersInFulfillment = [];
  let ordersFilled = [];
  if (!isLoading && !isError && data && data.orders && data.orders.data.pageContent) {
    let orders = data.orders.data.pageContent;
    ordersPlaced = orders.filter((el) => el.status == 'OrderPlaced');
    ordersReceived = orders.filter((el) => el.status == 'ReceivedForFulfillment');
    ordersInFulfillment = orders.filter((el) => el.status == 'InFulfillment');
    ordersFilled = orders.filter((el) => el.status == 'Finished');
  }
  return (
    <Layout activeTab="dashboard">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>
      {isError && <small className="text-muted">{`Uhoh, we've hit an error.`}</small>}
      <div className="my-4">
        <Row className="text-center">
          <Col md="3">
            <Card>
              <CardBody>
                <CardTitle tag="h5">
                  <span className="fa-layers fa-fw pb-2">
                    <FontAwesomeIcon className="text-danger" icon={faCircle} size="2x" transform="left-3" />
                    <FontAwesomeIcon icon={faExclamationCircle} inverse transform="shrink-2" />
                  </span>
                </CardTitle>
                <CardTitle tag="h4" className="m-0">
                  <strong>{!isLoading && !isError ? ordersPlaced.length : <Skeleton />}</strong>
                </CardTitle>
                <small className="text-muted">new orders</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardBody>
                <CardTitle tag="h5">
                  <span className="fa-layers fa-fw pb-2">
                    <FontAwesomeIcon className="text-warning" icon={faCircle} size="2x" transform="left-3" />
                    <FontAwesomeIcon icon={faShoppingCart} inverse transform="shrink-2" />
                  </span>
                </CardTitle>
                <CardTitle tag="h4" className="m-0">
                  <strong>{!isLoading && !isError ? ordersReceived.length : <Skeleton />}</strong>
                </CardTitle>
                <small className="text-muted">orders received</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardBody>
                <CardTitle tag="h5">
                  <span className="fa-layers fa-fw pb-2">
                    <FontAwesomeIcon className="text-info" icon={faCircle} size="2x" transform="left-3" />
                    <FontAwesomeIcon icon={faTruck} inverse transform="shrink-2" />
                  </span>
                </CardTitle>
                <CardTitle tag="h4" className="m-0">
                  <strong>{!isLoading && !isError ? ordersInFulfillment.length : <Skeleton />}</strong>
                </CardTitle>
                <small className="text-muted">orders in fulfillment</small>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardBody>
                <CardTitle tag="h5">
                  <span className="fa-layers fa-fw pb-2">
                    <FontAwesomeIcon className="text-success" icon={faCircle} size="2x" transform="left-3" />
                    <FontAwesomeIcon icon={faCheckCircle} inverse transform="shrink-2" />
                  </span>
                </CardTitle>
                <CardTitle tag="h4" className="m-0">
                  <strong>{!isLoading && !isError ? ordersFilled.length : <Skeleton />}</strong>
                </CardTitle>
                <small className="text-muted">orders fulfilled</small>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="my-4">
          <h4 className="mb-1">Recent Orders</h4>
          <Orders isLoading={isLoading} isError={isError} orders={data && data.orders && data.orders.data.pageContent ? data.orders.data.pageContent : []} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
