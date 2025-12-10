// src/components/cart/CartItem.js
import React from 'react';
import { Card, Button, Form, Image, Row, Col } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';//../../context/CartContext
import { useWishlist } from '../../context/WishlistContext';//../../context/WishlistContext
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext

const CartItem = ({ item }) => {
  const { updateItemQuantity, removeItemFromCart } = useCart();
  const { addItemToWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= 0) {
      await removeItemFromCart(item.product._id);
      showAlert('success', 'Item removed from cart');
    } else {
      await updateItemQuantity(item.product._id, newQuantity);
      showAlert('success', 'Cart updated');
    }
  };

  const handleMoveToWishlist = async () => {
    try {
      await addItemToWishlist(item.product._id);
      await removeItemFromCart(item.product._id);
      showAlert('success', 'Item moved to wishlist');
    } catch (error) {
      showAlert('danger', error.message || 'Failed to move item to wishlist');
    }
  };

  const handleRemoveItem = async () => {
    await removeItemFromCart(item.product._id);
    showAlert('success', 'Item removed from cart');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="mb-3 cart-item">
      <Card.Body>
        <Row>
          <Col md={3}>
            <Image src={item.product.image} alt={item.product.name} fluid rounded className="cart-item-image" />
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
            <div className="quantity-control mb-3">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </Button>
              <Form.Control
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="mx-2 text-center"
                style={{ width: '50px' }}
              />
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                +
              </Button>
            </div>
            <div className="d-grid gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleMoveToWishlist}
              >
                Move to Wishlist
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleRemoveItem}
              >
                Remove
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CartItem;