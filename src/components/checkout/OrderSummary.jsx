// src/components/checkout/OrderSummary.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';//../../context/CartContext

const OrderSummary = ({ placingOrder, onPlaceOrder, disabled }) => {
  const { cart } = useCart();

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

  return (
    <Card>
      <Card.Header as="h5">Order Summary</Card.Header>
      <Card.Body>
        <h6 className="mb-3">Order Items</h6>
        {cart && cart.items && cart.items.map(item => (
          <div key={item.product._id} className="d-flex justify-content-between mb-2">
            <div>
              {item.product.name} x {item.quantity}
            </div>
            <div>{formatPrice(item.product.price * item.quantity)}</div>
          </div>
        ))}
        <hr />
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
        <Button
          variant="primary"
          className="w-100"
          onClick={onPlaceOrder}
          disabled={disabled || placingOrder}
        >
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
        <div className="mt-3 text-center">
          <small className="text-muted">
            {calculateShipping() > 0 && `Add ${formatPrice(1000 - calculateSubtotal())} more for free shipping`}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;