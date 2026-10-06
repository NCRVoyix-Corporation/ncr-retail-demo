import Skeleton from 'react-loading-skeleton';
import { CardBody } from 'reactstrap';
export default function CartCheckout({ userAPICart, isLoading = false }) {
  const cartTotals = !isLoading ? userAPICart.cart.data : 0;
  return (
    <CardBody>
      <h4 className="font-weight-bold mb-4">Overview</h4>
      <div>
        <dl className="row my-0">
          <dt className="col-sm-6 text-muted">Subtotal</dt>
          <dd className="col-sm-6 text-right">{isLoading ? <Skeleton /> : Math.round((cartTotals.totals.grossAmount + Number.EPSILON) * 100) / 100}</dd>
        </dl>
        <dl className="row">
          <dt className="col-sm-6 text-muted">Taxes</dt>
          <dd className="col-sm-6 text-right">--</dd>
        </dl>
        <dl className="row">
          <dt className="col-sm-6">Total</dt>
          <dd className="col-sm-6 text-right border-top">{isLoading ? <Skeleton /> : Math.round((cartTotals.totals.balanceDue + Number.EPSILON) * 100) / 100}</dd>
        </dl>
        <a href="/checkout" className="btn btn-primary btn-block">
          Checkout
        </a>
      </div>
    </CardBody>
  );
}
