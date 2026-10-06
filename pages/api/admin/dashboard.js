import { getAllOrders } from '~/lib/order';

export default async function handler(req, res) {
  const siteID = req.url.split("=")[1];
  const orders = await getAllOrders(siteID);
  res.status(orders.status).json({
    orders,
    logs: [orders.log]
  });
}
