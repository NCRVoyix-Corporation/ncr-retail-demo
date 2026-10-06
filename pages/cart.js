import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { UserCartContext } from '~/context/userCart';
import { UserStoreContext } from '~/context/userStore';
import CartCheckout from '~/components/public/cart/CartCheckout';
import CartList from '~/components/public/cart/CartList';
import Layout from '~/components/public/Layout';
import useUserCart from '~/lib/swr/useUserCart';
import { mutate } from 'swr';

export default function Cart() {
  const { userCart, setUserCart } = useContext(UserCartContext);
  const { userStore } = useContext(UserStoreContext);
  const { data, isLoading, isError } = useUserCart(userCart, userStore);

  React.useEffect(() => {
    fetchCart();
  }, [userCart]);

  const fetchCart = () => {
    mutate(`/api/cart/${userStore.id}/${userCart.location}`);
  };

/*
  TODO: Needs to be fixed
  const emptyCart = () => {
    fetch(`/api/cart/${userStore.id}/${userCart.location}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then(() => {
        setUserCart({ totalQuantity: 0, etag: null, location: null });
      });
  };
*/

  if (isLoading) {
    return (
      <CartLayout data={data}>
        <Col md="8">
          <Card className="mb-2 cart-card">
            <CardBody>
              <Skeleton width="100%" />
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardBody>
              <CartCheckout isLoading={true} />
            </CardBody>
          </Card>
        </Col>
      </CartLayout>
    );
  }

  if (isError) {
    setUserCart({ totalQuantity: 0, etag: null, location: null });
    return (
      <CartLayout data={data}>
        <Col md="8">
          <Card className="mb-2 cart-card">
            <CardBody>
              <p>{`Uh oh, we've hit an error. Please try again.`}</p>
{/*           
              TODO: Fix Clear Cart functionality
              <Button onClick={() => emptyCart()} color="link" className="mt-1 text-muted p-0" size="sm">
                Clear Cart
              </Button>   
*/}
            </CardBody>
          </Card>
        </Col>
      </CartLayout>
    );
  }

  return (
    <CartLayout data={data}>
      <Col md="8">
        <Card className="mb-2 cart-card">
          {!data || data.cartItems.data.pageContent.length == 0 ? <CardBody className="">No cart items.</CardBody> : <CartList userAPICart={data} location={userCart.location} siteId={userStore.id} />}
        </Card>
        {data && data.cartItems.data.pageContent.length > 0 && (
          <Row>
            <Col>
{/*           TODO: Fix Clear Cart functionality
              <Button onClick={() => emptyCart()} color="link" className="mt-1 text-muted p-0" size="sm">
                Clear Cart
              </Button>
*/}
            </Col>
          </Row>
        )}
      </Col>
      <Col md="4">
        {data && data.cartItems.data.pageContent.length > 0 && (
          <Card>
            <CardBody>
              <CartCheckout userCart={userCart} userAPICart={data} />
            </CardBody>
          </Card>
        )}
      </Col>
    </CartLayout>
  );
}

const CartLayout = ({ data, children }) => {
  return (
    <Layout logs={data && data.logs ? data.logs : []} title="Cart">
      <Container className="my-4 flex-grow-1">
        <Row className="mb-2">
          <Col>
            <h4 className="mb-1">My Cart</h4>
          </Col>
        </Row>
        <Row>{children}</Row>
      </Container>
    </Layout>
  );
};
