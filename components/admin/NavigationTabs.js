import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faExternalLinkAlt, faList, faStore, faLayerGroup, faObjectGroup, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Nav, NavItem, NavLink } from 'reactstrap';

const NavigationTabs = ({ activeTab, tabs = true }) => {
  return (
    <>
      <Nav navbar={!tabs ? true : false} className="flex-column">
        <NavItem>
          <a href="/admin/dashboard" className={`nav-link ${activeTab === 'dashboard' && 'active'} ${!tabs && 'pl-0'}`}>
            <FontAwesomeIcon icon={faTachometerAlt} size="sm" className="feather" />
            Dashboard
          </a>
        </NavItem>
        <NavItem>
          <a href="/admin/orders" className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faList} className="feather" size="sm" />
            Orders
          </a>
        </NavItem>
        <NavItem>
          <a href="/admin/sites" className={`nav-link ${activeTab === 'sites' && 'active'}`}>
            <FontAwesomeIcon icon={faStore} className="feather" size="sm" />
            Sites
          </a>
        </NavItem>
        <NavItem>
          <a href="/admin/categories" className={`nav-link ${activeTab === 'categories' && 'active'}`}>
            <FontAwesomeIcon icon={faLayerGroup} className="feather" size="sm" />
            Categories
          </a>
        </NavItem>
        <NavItem>
          <a href="/admin/groups" className={`nav-link ${activeTab === 'groups' && 'active'}`}>
            <FontAwesomeIcon icon={faObjectGroup} className="feather" size="sm" />
            Groups
          </a>
        </NavItem>
        <NavItem>
          <a href="/admin/catalog" className={`nav-link ${activeTab === 'catalog' && 'active'}`}>
            <FontAwesomeIcon icon={faShoppingCart} className="feather" size="sm" />
            Global Catalog
          </a>
        </NavItem>
      </Nav>
      <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">Resources</h6>
      <Nav>
        <NavItem>
          <NavLink href="https://developer.ncrvoyix.com/" target="_blank">
            <FontAwesomeIcon icon={faExternalLinkAlt} className="feather" size="sm" />
            NCR Voyix Documentation & API Specs
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://github.com/NCR-Corporation/ncr-retail-demo" target="_blank">
            <FontAwesomeIcon icon={faExternalLinkAlt} className="feather" size="sm" />
            Github Respository
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
};

export default NavigationTabs;
