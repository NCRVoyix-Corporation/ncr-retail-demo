import { createOrder } from '~/lib/order';
import { updateUserCartStatus } from '~/lib/cart';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let logs = [];
    let body = JSON.parse(req.body);
    const { cart, lineItems, user, shipping, payment, store } = body;
    let expiryDate = payment.expiryDate.split(' / ');
    let order = {
      channel: 'Web',
      currency: body.cart.defaultCurrency,
      customer: {
        id: user.username,
        name: user.fullName,
        firstName: user.givenName,
        lastName: user.familyName,
        phone: user.phone ?? '',
        email: user.email ?? ''
      },
      owner: store.siteName,
      status: 'OrderPlaced',
      totals: [
        {
          type: 'Net',
          value: cart.totals.netAmount
        }
      ],
      fulfillment: {
        address: {
          line1: shipping.street,
          city: shipping.city,
          state: shipping.state,
          country: shipping.country,
          postalCode: shipping.postalCode
        },
        type: 'Delivery'
      },
      orderLines: [],
      payment: [
        {
          amount: cart.totals.netAmount,
          status: 'Paid',
          type: 'CreditDebit',
          maskedPAN: payment.cardNumber,
          expiration: {
            month: expiryDate[0],
            year: expiryDate[1]
          },

          subType: 'VISA', // tochange,
          payBalance: false,
          paymentTime: new Date().toISOString()
        }
      ]
    };

    lineItems.forEach((item) => {
      order['orderLines'].push({
        lineId: item.lineId,
        description: item.description,
        extendedAmount: item.extendedAmount,
        itemType: item.itemType,
        quantity: item.quantity,
        taxes: item.taxes,
        unitPrice: item.price.unitPrice,
        scanData: item.scanData
      });
    });

    let result = await createOrder(store.id, order);
    logs.push(result.log);
    
    let userCart = body.userCart;
    let userCartStatus = await updateUserCartStatus(store.id, userCart.location, 'Closed');
    logs.push(userCartStatus.log);
    res.status(200).json({ response: result, logs });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
