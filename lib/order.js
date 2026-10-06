import sendRequest from './sendRequest';
const baseUrl = `https://gateway-staging.ncrcloud.com/order/3/orders/1`;

export async function createOrder(siteId, order) {
  return await sendRequest(`${baseUrl}`, 'POST', order, siteId);
}

export async function getOrderById(id) {
  return await sendRequest(`${baseUrl}/${id}`, 'GET');
}

export async function getOrdersByUser(user) {
  let obj = {
    customerId: user,
    returnFullOrders: true,
    sort: { column: 'CreatedDate', direction: 'Desc' }
  };
  return await sendRequest(`${baseUrl}/find?pageSize=100`, 'POST', obj);
}

export async function updateOrderById(siteId, id, values) {
  return await sendRequest(`${baseUrl}/${id}`, 'PATCH', values, siteId);
}

export async function getAllOrders(siteID) {
  let obj = {
    enterpriseUnitId: siteID,
    returnFullOrders: true
  };
  return await sendRequest(`${baseUrl}/find?pageSize=100`, 'POST', obj);
}