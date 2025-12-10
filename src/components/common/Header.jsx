// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';//../../context/AuthContext
import { useCart } from '../../context/CartContext';//../../context/CartContext
import { useWishlist } from '../../context/WishlistContext';//../../context/WishlistContext

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = getCartItemsCount();
  const wishlistCount = wishlist.length;

  return (
    <Navbar bg="light" expand="lg" className="sticky-top">
      <div className="container">
        <Navbar.Brand as={Link} to="/">MyShoppingSite</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" active={location.pathname.startsWith('/products')}>
              Products
            </Nav.Link>
          </Nav>
          <Form className="d-flex mx-auto" onSubmit={handleSearch} style={{ width: '40%' }}>
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="outline-success">Search</Button>
          </Form>
          <Nav>
            <Nav.Link as={Link} to="/wishlist">
              Wishlist
              {wishlistCount > 0 && (
                <Badge bg="danger" className="ms-1">{wishlistCount}</Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart
              {cartItemsCount > 0 && (
                <Badge bg="danger" className="ms-1">{cartItemsCount}</Badge>
              )}
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;