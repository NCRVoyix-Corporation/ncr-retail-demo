import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { Col, Row, Button, FormGroup, Input } from 'reactstrap';
import { UserCartContext } from '~/context/userCart';
import { UserStoreContext } from '~/context/userStore';

export default function CartItem({ location, item, itemKey }) {
  const [qty, setQty] = useState(item.quantity.value);
  const { userCart, setUserCart } = useContext(UserCartContext);
  const { userStore } = useContext(UserStoreContext);

  const removeFromCart = (itemKey) => {
    fetch(`/api/cart/${location}`, {
      method: 'DELETE',
      body: JSON.stringify({
        siteId: userStore.id,
        cartId: location,
        lineItemId: itemKey
      })
    })
      .then((res) => res.json())
      .then(() => {
        let totalQuantity = userCart.totalQuantity - item.quantity.value;
        userCart.totalQuantity = totalQuantity;
        setUserCart(userCart);
      });
  };

  const handleQuantityChange = (event, item) => {
    let previousQty = item.quantity.value;
    let newQty = parseInt(event.target.value);
    let itemObj = {
      itemId: {
        itemCode: item.itemId.value
      },
      quantity: newQty
    };
    fetch(`/api/cart`, {
      method: 'POST',
      body: JSON.stringify({
        siteId: userStore.id,
        cart: userCart,
        etag: userCart.etag ?? false,
        location: userCart.location ?? false,
        item: itemObj,
        fromCart: true
      })
    })
      .then((response) => response.json())
      .then((data) => {
        userCart.location = data.location;
        userCart.etag = data.etag;
        userCart.totalQuantity = userCart.totalQuantity - previousQty + newQty;
        setUserCart(userCart);
        setQty(newQty);
      });
  };
  return (
    <Row className="d-flex align-items-center">
      <Col sm="12" md="10">
        <Row className="w-100 no-gutters">
          <Col sm="6" md="8" className="mb-2">
            <a href={`/catalog/${item.itemId.value}`} className="h5 card-title mb-2">
              {item.description}
            </a>
            <h6 className="text-muted">
              ${item.price.unitPrice} {item.quantity.unitOfMeasure}
            </h6>
          </Col>
          <Col sm="4" md="2">
            <FormGroup>
              <Input type="select" name="select" id="qtySelect" value={qty} onChange={() => handleQuantityChange(event, item)}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col sm="2">
            <Button onClick={() => removeFromCart(itemKey)} color="link" className="float-right mt-1 text-muted p-0">
              <FontAwesomeIcon icon={faTimesCircle} size="lg" />
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
