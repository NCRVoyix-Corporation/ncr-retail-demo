import { getCartById, getCartItemsById, deleteCart } from '~/lib/cart';

export default async function handler(req, res) {
  let siteId = req.query.params[0];
  let cartId = req.query.params[1];
  let etag = req.headers['if-match'] || req.query.etag;

  // The cart etag is only known to the party that created/last touched the cart,
  // so it acts as a proof-of-ownership token. Without it, requesting a cartId
  // alone (e.g. an incremented/guessed id) must not grant access.
  const cart = await getCartById(siteId, cartId);
  if (cart.status !== 200 || !etag || cart.data?.etag !== etag) {
    res.status(403).json({ error: 'Not authorized to access this cart' });
    return;
  }

  if (req.method == 'DELETE') {
    const result = await deleteCart(siteId, cartId);
    res.status(result.status).json({ result, logs: [result.log] });
  } else {
    const cartItems = await getCartItemsById(siteId, cartId);
    if (cartItems.status !== 200) {
      res.status(cartItems.status).json(cartItems);
    }
    res.status(cartItems.status).json({ cart, cartItems, logs: [cart.log, cartItems.log] });
  }
}
