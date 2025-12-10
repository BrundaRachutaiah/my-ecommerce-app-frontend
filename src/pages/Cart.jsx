// src/pages/Cart.js
import React from 'react';
import { Container, Row, Col, Button, Form, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';//../context/CartContext
import { useWishlist } from '../context/WishlistContext';//../context/WishlistContext
import { useAlert } from '../context/AlertContext';//../context/AlertContext
import Loading from '../components/common/Loading';//../components/common/Loading

const Cart = () => {
  const { cart, loading, updateItemQuantity, removeItemFromCart, getCartTotal } = useCart();
  const { addItemToWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity <= 0) {
      const result = await removeItemFromCart(productId);
      showAlert(result.success ? 'success' : 'danger', result.message);
    } else {
      const result = await updateItemQuantity(productId, quantity);
      showAlert(result.success ? 'success' : 'danger', result.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeItemFromCart(productId);
    showAlert(result.success ? 'success' : 'danger', result.message);
  };

  const handleMoveToWishlist = async (productId) => {
    const result = await addItemToWishlist(productId);
    if (result.success) {
      await removeItemFromCart(productId);
      showAlert('success', 'Item moved to wishlist');
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

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      return total + ((originalPrice - item.product.price) * item.quantity);
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 100; // Free shipping for orders over ₹1000
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  if (loading) return <Loading />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p className="mb-4">Looks like you haven't added anything to your cart yet.</p>
        <Button as={Link} to="/products" variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Shopping Cart</h1>
      
      <Row>
        <Col md={8}>
          {cart.items.map(item => (
            <Card key={item.product._id} className="mb-3">
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Image src={item.product.image} alt={item.product.name} fluid rounded />
                  </Col>
                  <Col md={6}>
                    <h5>{item.product.name}</h5>
                    <p className="text-muted">{item.product.category?.name}</p>
                    <div className="d-flex align-items-center mb-2">
                      <span className="h5 mb-0">{formatPrice(item.product.price)}</span>
                      {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                        <span className="text-decoration-line-through text-muted ms-2">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {item.size && (
                      <p className="mb-2">Size: {item.size}</p>
                    )}
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center mb-3">
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                        style={{ width: '70px' }}
                      />
                    </div>
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleMoveToWishlist(item.product._id)}
                      >
                        Move to Wishlist
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          
          <div className="d-flex justify-content-between mt-4">
            <Button as={Link} to="/products" variant="outline-primary">
              Continue Shopping
            </Button>
          </div>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Order Summary</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>
              {calculateDiscount() > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount:</span>
                  <span>-{formatPrice(calculateDiscount())}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>{calculateShipping() === 0 ? 'Free' : formatPrice(calculateShipping())}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5>{formatPrice(calculateTotal())}</h5>
              </div>
              <Button as={Link} to="/checkout" variant="primary" className="w-100">
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;