import { useState } from 'react';
import Router from 'next/router';
import React from 'react';
import { faTachometerAlt, faExternalLinkAlt, faList, faStore, faLayerGroup, faObjectGroup, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWrench } from '@fortawesome/free-solid-svg-icons';
import { Collapse, Nav, Navbar, NavItem, NavbarToggler, NavLink, Button, Popover, PopoverBody, PopoverHeader, Spinner, NavbarBrand } from 'reactstrap';

const Header = ({ activeTab, tabs = true }) => {
  const [exporting, setIsExporting] = useState(false);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);
  const toggle = () => setPopoverOpen(!popoverOpen);

  const buildSampleDatabase = () => {
    setIsExporting(true);
    fetch(`/api/export`)
      .then((res) => res.json())
      .then(() => {
        setIsExporting(false);
        Router.reload(window.location.pathname);
      });
  };

  return (
    <>
      <Navbar dark sticky="true" className="flex-md-no-wrap pb-3 pb-md-auto sticky-top shadow header-top" expand="md">
        <NavbarBrand href="/admin/dashboard" className="col-md-3 col-lg-2 mr-0 px-3 logo-text">
          MART
        </NavbarBrand>
        <NavbarToggler onClick={toggleNav} className="navToggle" />
        <Collapse isOpen={isOpen} navbar className="flex-row-reverse navbar-collapse pl-1">
          <Nav className="px-md-3">
            <div className="flex-column d-block d-sm-none">
              <NavItem>
                <a href="/admin/dashboard" className={`nav-link ${activeTab === 'dashboard' && 'active'} ${!tabs && 'pl-0'}`}>
                  <FontAwesomeIcon icon={faTachometerAlt} size="sm" className="feather mr-2 pl-1" />
                  Dashboard
                </a>
              </NavItem>
              <NavItem>
                <a href="/admin/orders" className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={faList} className="feather mr-2 pl-1" size="sm" />
                  Orders
                </a>
              </NavItem>
              <NavItem>
                <a href="/admin/sites" className={`nav-link ${activeTab === 'sites' && 'active'}`}>
                  <FontAwesomeIcon icon={faStore} className="feather mr-2 pl-1" size="sm" />
                  Sites
                </a>
              </NavItem>
              <NavItem>
                <a href="/admin/categories" className={`nav-link ${activeTab === 'categories' && 'active'}`}>
                  <FontAwesomeIcon icon={faLayerGroup} className="feather mr-2 pl-1" size="sm" />
                  Categories
                </a>
              </NavItem>
              <NavItem>
                <a className={`nav-link ${activeTab === 'groups' && 'active'}`}>
                  <FontAwesomeIcon icon={faObjectGroup} className="feather mr-2 pl-1" size="sm" />
                  Groups
                </a>
              </NavItem>
              <NavItem>
                <a href="/admin/catalog" className={`nav-link ${activeTab === 'catalog' && 'active'}`}>
                  <FontAwesomeIcon icon={faShoppingCart} className="feather mr-2 pl-1" size="sm" />
                  Global Catalog
                </a>
              </NavItem>
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-white">Resources</h6>

              <NavItem>
                <NavLink href="https://developer.ncrvoyix.com/" target="_blank">
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="feather mr-2" size="sm" />
                  NCR Voyix Documentation & API Specs
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/NCR-Corporation/ncr-retail-demo" target="_blank">
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="feather mr-2" size="sm" />
                  Github Respository
                </NavLink>
              </NavItem>
            </div>
            <div className="px-2 build-database">
              <NavItem>
                <NavLink href="/" className="pl-1">
                  <FontAwesomeIcon icon={faHome} size="1x" /> Home
                </NavLink>
              </NavItem>
              <NavItem>
                <>
                  <Button id="Popover1" type="button" color="primary" className="float-right" onClick={() => buildSampleDatabase()}>
                    {exporting ? <Spinner color="light" size="sm" /> : <FontAwesomeIcon icon={faWrench} size="1x" />} Build Sample Database
                  </Button>
                  <Popover placement="left" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                    <PopoverHeader>Setup Required.</PopoverHeader>
                    <PopoverBody>
                      Application keys are required to build out the datbase. Check out the{' '}
                      <a href="https://github.com/NCR-Corporation/ncr-retail-demo" target="_blank" rel="noreferrer">
                        Github README
                      </a>{' '}
                      for more information.
                    </PopoverBody>
                  </Popover>
                </>
              </NavItem>
            </div>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default Header;
