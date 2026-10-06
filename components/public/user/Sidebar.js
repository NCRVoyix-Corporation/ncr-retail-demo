import { ListGroup } from 'reactstrap';

export default function Sidebar({ url }) {
  return (
    <ListGroup>
      <a href="/user/profile" className={`list-group-item ${url === 'profile' && 'active'}`}>
        Profile
      </a>
      <a href="/user/orders" className={`list-group-item ${url === 'orders' && 'active'}`}>
        Orders
      </a>
      {/* <Link href="/user/payments">
        <a
          className={`list-group-item ${
            url === 'payments' && 'active'
          } disabled`}
        >
          Payment Methods
        </a>
      </Link>
      <Link href="/user/password">
        <a
          className={`list-group-item ${
            url === 'password' && 'active'
          } disabled`}
        >
          Change Password
        </a>
      </Link> */}
    </ListGroup>
  );
}
