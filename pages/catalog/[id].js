import { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { Container, Spinner, Card, Row, Col, CardTitle, Breadcrumb, BreadcrumbItem, CardBody, CardSubtitle, CardText, Button, FormGroup, Input } from 'reactstrap';
import { UserStoreContext } from '~/context/userStore';
import { UserCartContext } from '~/context/userCart';
import useCatalogItem from '~/lib/swr/useCatalogItem';
import Skeleton from 'react-loading-skeleton';
import Layout from '~/components/public/Layout';

const CatalogItem = ({ id }) => {
  const { userStore } = useContext(UserStoreContext);
  const { userCart, setUserCart } = useContext(UserCartContext);
  let { data, isLoading, isError } = useCatalogItem(id, userStore.id);
  const [quantity, setItemQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleAddToCart = (itemObj) => {
    console.log("itemObj", itemObj)
    itemObj['quantity'] = quantity;
    setAddingToCart(true);
    setAddedToCart(false);
    fetch(`/api/cart`, {
      method: 'POST',
      body: JSON.stringify({
        siteId: userStore.id,
        cart: userCart,
        etag: userCart.etag ?? false,
        location: userCart.location ?? false,
        item: itemObj
      })
    })
      .then((response) => response.json())
      .then((res) => {
        userCart.location = res.location;
        userCart.etag = res.etag;
        userCart.totalQuantity = userCart.totalQuantity ? userCart.totalQuantity + quantity : quantity;
        setUserCart(userCart);
        setAddedToCart(true);
        setAddingToCart(false);

        let newLogs = data.logs.concat(res.logs);
        setLogs(newLogs);
      });
  };

  const handleQuantityChange = (event) => {
    const qty = parseInt(event.target.value);
    setItemQuantity(qty);
  };

  if (isLoading) {
    return (
      <Layout>
        <Container className="my-4 flex-grow-1">
          <Breadcrumb className="bg-white shadow-sm">
            {[...Array(2).keys()].map((index) => (
              <BreadcrumbItem key={index}>
                <Skeleton width="50px" />
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <Card className="mb-3 border-0 shadow-sm">
            <Row className="no-gutters">
              <Col sm="4">
                <div className="pt-3 pb-4 px-4">
                  <Skeleton height="225px" />
                </div>
              </Col>
              <Col sm="8">
                <CardBody className="h-100 d-flex flex-column pb-5">
                  <CardTitle tag="h2" className="bd-highlight">
                    <Skeleton width="50%" />
                  </CardTitle>
                  <CardSubtitle className="mb-2 text-muted">
                    <Skeleton width="20%" />
                  </CardSubtitle>
                  <CardText>
                    <Skeleton width="75%" />
                  </CardText>
                  <div className="mt-auto p-2">
                    <div className="d-flex justify-content-between mb-3">
                      <div className="flex-fill">
                        <Skeleton width="50%" />
                      </div>
                      <Row className="flex-fill text-right">
                        <Col />
                        <Col sm="4">
                          <Skeleton />
                        </Col>
                        <Col sm="6">
                          <Skeleton />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardBody>
              </Col>
            </Row>
          </Card>
        </Container>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Container className="my-4 flex-grow-1">
          <p className="text-muted">{`Uhoh, we've hit an error.`}</p>
        </Container>
      </Layout>
    );
  }
  return (
    <Layout logs={logs.length == 0 && data && data.logs ? data.logs : logs} title={!isLoading && data && data.catalogItem && data.catalogItem.data.item.shortDescription.values[0].value}>
      <Container className="my-4 flex-grow-1">
        <Breadcrumb className="bg-white shadow-sm">
          {data.catalogItem &&
            data.catalogItem.data['categories'].length > 0 &&
            data.catalogItem.data['categories'].map((ancestor) => (
              <BreadcrumbItem key={ancestor.nodeCode}>
                <Link href={`/category/${ancestor.nodeCode}`}>{ancestor.title.value}</Link>
              </BreadcrumbItem>
            ))}
        </Breadcrumb>
        <Card className="mb-3 border-0 shadow-sm">
          <Row className="no-gutters">
            <Col sm="4">
              {data.catalogItem && (
                <Image
                  src={
                    data.catalogItem.data.itemAttributes && data.catalogItem.data.itemAttributes.imageUrls.length > 0
                      ? data.catalogItem.data.itemAttributes.imageUrls[0]
                      : 'https://via.placeholder.com/500'
                  }
                  layout="responsive"
                  width={500}
                  height={500}
                  alt={data.catalogItem.data.item.shortDescription.values[0].value}
                  className="p-4"
                />
              )}
            </Col>
            <Col sm="8">
              <CardBody className="h-100 d-flex flex-column pb-5">
                {data.catalogItem && (
                  <CardTitle tag="h2" className="bd-highlight">
                    {data.catalogItem.data.item.shortDescription.values[0].value}
                  </CardTitle>
                )}
                {data.catalogItem && (
                  <CardSubtitle className="mb-2 text-muted">
                    <strong>Item #:</strong> {data.catalogItem.data.item.itemId.itemCode}
                  </CardSubtitle>
                )}
                {data.catalogItem && <CardText>{data.catalogItem.data.item.longDescription.values[0].value}</CardText>}
                <div className="mt-auto p-2">
                  <div className="d-flex justify-content-between mb-3">
                    <div className="flex-fill">
                      {data.catalogItem && <h3 className="text-muted">{data.catalogItem.data.itemPrices ? `$${data.catalogItem.data.itemPrices[0].price}` : 'Not available at this store'}</h3>}
                    </div>
                    <Row className="flex-fill text-right">
                      <Col />
                      <Col sm="4">
                        <FormGroup>
                          <Input type="select" name="select" id="qtySelect" value={quantity} onChange={handleQuantityChange}>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <Button
                          block
                          onClick={() => handleAddToCart(data.catalogItem.data.item)}
                          className={`${addedToCart && 'fade-btn'}`}
                          color={addedToCart ? 'success' : 'primary'}
                          outline
                          onAnimationEnd={() => setAddedToCart(false)}
                        >
                          {addingToCart && <Spinner size="sm" />}
                          {addedToCart ? (
                            <div>
                              <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                              {'  '}Added
                            </div>
                          ) : (
                            'Add to Cart'
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </CardBody>
            </Col>
          </Row>
        </Card>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      id: context.params.id
    }
  };
}

export default CatalogItem;
