import { getOrderById, updateOrderById } from '~/lib/order';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getSession({ req });
    let order = await getOrderById(req.query.id);
    if (order.status !== 200) {
      res.status(order.status).json(order);
    }
    if (order.data.customer.id !== session.user.username) {
      console.log("THROW HELPFUL ERROR HERE");
      res.status(403).json({ logs: [order.log] });
    } else {
      res.status(200).json({ order, logs: [order.log] });
    }
  } else {
    // Post request.
    let body = JSON.parse(req.body);
    let data = await updateOrderById(body.siteId, body.orderId, body.values);
    res.status(data.status).json({ data, logs: [data.log] });
  }
}
