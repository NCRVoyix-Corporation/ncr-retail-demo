import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { Container, Collapse, Navbar, NavbarToggler, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const SubHeader = ({ data, userStore, setIsModalOpen, isLoading, isError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Container className="py-2 bg-white">
      <Navbar expand="md" className="p-0 subheader-navbar" light color="faded">
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {!isError && (
            <Nav navbar>
              <NavItem>
                <a href="/catalog" className="pl-0 nav-link">
                  All Items
                </a>
              </NavItem>
              {!isLoading &&
                !isError &&
                data &&
                data.categories &&
                data.categories.length > 0 &&
                data.categories.map((category) => {
                  let children = category.children;
                  delete children['array'];
                  if (Object.keys(children).length > 0) {
                    return (
                      <UncontrolledDropdown nav inNavbar key={category.nodeCode}>
                        <DropdownToggle nav caret>
                          {category.title.value}
                        </DropdownToggle>
                        <DropdownMenu right>
                          {/* <Row>
                          <Col sm={12} md={4}> */}
                          {Object.keys(children).map((child) => (
                            <Link key={children[child].nodeCode} href={`/category/${children[child].nodeCode}`}>
                              <DropdownItem>{children[child].title.value}</DropdownItem>
                            </Link>
                          ))}
                          {/* </Col>
                        </Row> */}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    );
                  }
                  return (
                    <UncontrolledDropdown className="py-2 pl-1" nav inNavbar key={category.nodeCode}>
                      <a href={`/category/${category.nodeCode}`} className="text-darker">
                        {category.title.value}
                      </a>
                    </UncontrolledDropdown>
                  );
                })}
            </Nav>
          )}
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret suppressHydrationWarning>
                <FontAwesomeIcon icon={faStore} /> {userStore != undefined ? userStore.siteName : 'Set Store'}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => setIsModalOpen(true)}>Change Store</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </Container>
  );
};

export default SubHeader;
