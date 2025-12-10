// src/pages/Wishlist.js
import React from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';//../context/WishlistContext
import { useCart } from '../context/CartContext';//../context/CartContext
import { useAlert } from '../context/AlertContext';//../context/AlertContext
import Loading from '../components/common/Loading';//../components/common/Loading

const Wishlist = () => {
  const { wishlist, loading, removeItemFromWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const { showAlert } = useAlert();

  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeItemFromWishlist(productId);
    showAlert(result.success ? 'success' : 'danger', result.message);
  };

  const handleAddToCart = async (productId) => {
    const result = await addItemToCart(productId);
    if (result.success) {
      await removeItemFromWishlist(productId);
      showAlert('success', 'Item added to cart and removed from wishlist');
    } else {
      showAlert('danger', result.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <Loading />;

  if (!wishlist || wishlist.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your Wishlist is Empty</h2>
        <p className="mb-4">Start adding items you love to your wishlist.</p>
        <Button as={Link} to="/products" variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">My Wishlist</h1>
      
      <Row>
        {wishlist.map(item => (
          <Col key={item._id} md={4} className="mb-4">
            <Card className="h-100">
              <Link to={`/products/${item._id}`} className="text-decoration-none">
                <div className="position-relative overflow-hidden">
                  <Card.Img variant="top" src={item.image} alt={item.name} />
                  {item.discount > 0 && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-danger">{item.discount}% OFF</span>
                    </div>
                  )}
                </div>
              </Link>
              <Card.Body className="d-flex flex-column">
                <Card.Title as="div">
                  <Link to={`/products/${item._id}`} className="text-decoration-none text-dark">
                    <strong>{item.name}</strong>
                  </Link>
                </Card.Title>
                <Card.Text as="div" className="mb-2">
                  <div className="d-flex align-items-center">
                    <span className="text-warning">
                      {'★'.repeat(Math.floor(item.rating))}
                      {'☆'.repeat(5 - Math.floor(item.rating))}
                    </span>
                    <span className="ms-2 text-muted">({item.numReviews})</span>
                  </div>
                </Card.Text>
                <Card.Text as="div" className="mb-3">
                  <div className="d-flex align-items-center">
                    <span className="h5 mb-0">{formatPrice(item.price)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-decoration-line-through text-muted ms-2">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </Card.Text>
                <div className="mt-auto">
                  <Button
                    variant="primary"
                    className="w-100 mb-2"
                    onClick={() => handleAddToCart(item._id)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                  >
                    Remove from Wishlist
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishlist;