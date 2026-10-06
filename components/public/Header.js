import React, { useState, useContext, useEffect } from 'react';
import Logger from '~/components/api-logger/Logger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Container, Nav, NavItem, Row, Col, Button, Badge } from 'reactstrap';
import FindStoreModal from './sites/FindStoreModal';
import { UserStoreContext } from '~/context/userStore';
import SubHeader from './SubHeader';
import SearchBar from './SearchBar';
import { UserCartContext } from '~/context/userCart';
import ProfileDropdown from '../auth/ProfileDropdown';
import useMenu from '~/lib/swr/useMenu';

export default function Header({ logs }) {
  const { data, isLoading, isError } = useMenu();
  const { userStore } = useContext(UserStoreContext);
  const { userCart } = useContext(UserCartContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  useEffect(() => {
    if (Object.keys(userStore).length == 0) {
      setIsModalOpen(true);
    }
  }, [isModalOpen]);

  return (
    <div className="bg-white">
      <FindStoreModal modalProp={isModalOpen} toggle={toggleModal} />
      <header className="section-header shadow-sm">
        <section className="header-top border-lighter">
          <Container>
            <Nav className="d-flex justify-content-between row">
              <NavItem>
                <Logger logs={logs ?? []} />
              </NavItem>
              <NavItem>
                <a href="/admin/dashboard" className="nav-link">
                  <FontAwesomeIcon icon={faCog} size="1x" /> Manage
                </a>
              </NavItem>
            </Nav>
          </Container>
        </section>
        <section className="header-main border-bottom py-3">
          <Container>
            <Row className="align-items-center">
              <Col sm="4" md="3">
                <a href="/" className="logo-text">
                  MART
                </a>
              </Col>
              <Col sm="8" md="5">
                <SearchBar />
              </Col>
              <Col sm="12" md="4" className="text-sm-left text-md-right text-white">
                <div className="d-flex justify-content-end align-items-center">
                  <div className="pr-4 d-flex flex-column justify-content-start">
                    <ProfileDropdown />
                  </div>
                  <div className="pl-2 d-flex align-items-center justify-content-between text-white border-left border-white border-1">
                    <a href="/cart" style={{ border: 'none !important' }}>
                      <Button color="light" outline className="border-none cart-btn">
                        <FontAwesomeIcon icon={faShoppingCart} size="1x" className="pr-1" /> Cart
                        {userCart && userCart.totalQuantity != null && userCart.totalQuantity > 0 && (
                          <Badge color="warning" className="ml-1">
                            {userCart.totalQuantity}
                          </Badge>
                        )}
                      </Button>
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <SubHeader data={data} userStore={userStore} setIsModalOpen={setIsModalOpen} isLoading={isLoading} isError={isError} />
      </header>
    </div>
  );
}
