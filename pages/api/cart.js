import { createCart, addItemToCart, getCartItemsById, updateItemInCartById } from '~/lib/cart';
let logs = [];
export default async function handler(req, res) {
  let body = JSON.parse(req.body);
  if (body.etag === false || body.location === false) {
    let cart = await createCart(body.siteId);
    logs.push(cart.log);
    let location = cart.headers.get('location');
    let etag = cart.headers.get('ETag');
    let cartId = location.split('/')[2];
    let item = body.item;

    let obj = {
      itemId: item.itemId.itemCode,
      scanData: item.itemId.itemCode,
      quantity: {
        unitOfMeasure: 'EA', // ???
        value: item.quantity
      }
    };
    let addToCart = await addItemToCart(body.siteId, cartId, etag, obj);
    logs.push(addToCart.log);
    res.status(addToCart.status).json({ etag, location: cartId, logs });
  } else {
    let cartId = body.location;
    let etag = body.etag;
    let cartItems = await getCartItemsById(body.siteId, cartId);
    logs.push(cartItems.log);

    let item = body.item;
    let itemId = body.item.itemId.itemCode;
    // Check if we need to update.
    let update = false;
    let pageContent = cartItems.data.pageContent;
    for (let index = 0; index < pageContent.length; index++) {
      const element = pageContent[index];
      if (element.itemId.value === itemId) {
        update = element;
        break;
      }
    }
    if (!update) {
      let obj = {
        itemId: item.itemId.itemCode,
        scanData: item.itemId.itemCode,
        quantity: {
          unitOfMeasure: 'EA', // ???
          value: item.quantity
        }
      };
      let addItemToExistingCart = await addItemToCart(body.siteId, cartId, etag, obj);
      logs.push(addItemToExistingCart.log);
    } else {
      let updateObj = {
        quantity: {
          unitOfMeasure: 'EA',
          value: body.fromCart ? item.quantity : update.quantity.value + item.quantity
        }
      };
      let lineId = update.lineId;
      let updateItemInCart = await updateItemInCartById(body.siteId, cartId, etag, lineId, updateObj);
      logs.push(updateItemInCart.log);
    }
    res.status(200).json({ status: 200, etag, location: cartId, logs });
  }
}
