// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAddresses, createOrder } from '../api/apiService';//../api/apiService
import { useCart } from '../context/CartContext';//../context/CartContext
import { useAlert } from '../context/AlertContext';//../context/AlertContext
import Loading from '../components/common/Loading';//../components/common/Loading

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  const { cart, getCartTotal } = useCart();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data.addresses);
      
      // Set default address if available
      const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else if (response.data.addresses.length > 0) {
        setSelectedAddress(response.data.addresses[0]._id);
      }
    } catch (error) {
      showAlert('danger', 'Failed to fetch addresses');
    } finally {
      setLoading(false);
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

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showAlert('warning', 'Please select a delivery address');
      return;
    }

    setPlacingOrder(true);
    
    try {
      const selectedAddressData = addresses.find(addr => addr._id === selectedAddress);
      
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size
      }));
      
      const orderData = {
        orderItems,
        shippingAddress: selectedAddressData,
        paymentMethod,
        itemsPrice: calculateSubtotal(),
        taxPrice: 0,
        shippingPrice: calculateShipping(),
        totalPrice: calculateTotal()
      };
      
      const response = await createOrder(orderData);
      setOrderData(response.data.order);
      setOrderPlaced(true);
      showAlert('success', 'Order placed successfully!');
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <Loading />;

  if (orderPlaced) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="success" className="mb-4">
          <h1>Order Placed Successfully!</h1>
          <p className="mb-0">Thank you for your purchase. Your order has been placed successfully.</p>
        </Alert>
        
        <Card className="mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Header as="h5">Order Details</Card.Header>
          <Card.Body>
            <p><strong>Order ID:</strong> {orderData._id}</p>
            <p><strong>Payment Method:</strong> {orderData.paymentMethod}</p>
            <p><strong>Total Amount:</strong> {formatPrice(orderData.totalPrice)}</p>
            <p className="mb-0">You will receive an email confirmation shortly.</p>
          </Card.Body>
        </Card>
        
        <Button variant="primary" onClick={() => navigate('/profile')}>
          View Order History
        </Button>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p className="mb-4">Add items to your cart before proceeding to checkout.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Checkout</h1>
      
      <Row>
        <Col md={8}>
          {/* Delivery Address Section */}
          <Card className="mb-4">
            <Card.Header as="h5">Delivery Address</Card.Header>
            <Card.Body>
              {addresses.length === 0 ? (
                <div className="text-center py-3">
                  <p>You haven't added any addresses yet.</p>
                  <Button variant="primary" onClick={() => navigate('/address')}>
                    Add Address
                  </Button>
                </div>
              ) : (
                <Form>
                  {addresses.map(address => (
                    <Form.Check
                      key={address._id}
                      type="radio"
                      id={`address-${address._id}`}
                      name="address"
                      label={
                        <div>
                          <strong>{address.name}</strong>
                          {address.isDefault && <span className="badge bg-primary ms-2">Default</span>}
                          <br />
                          {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                          <br />
                          {address.country}
                          <br />
                          Phone: {address.phone}
                        </div>
                      }
                      checked={selectedAddress === address._id}
                      onChange={() => setSelectedAddress(address._id)}
                      className="mb-3"
                    />
                  ))}
                  <Button variant="outline-primary" onClick={() => navigate('/address')}>
                    Add New Address
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
          
          {/* Payment Method Section */}
          <Card className="mb-4">
            <Card.Header as="h5">Payment Method</Card.Header>
            <Card.Body>
              <Form>
                <Form.Check
                  type="radio"
                  id="payment-cod"
                  name="paymentMethod"
                  label="Cash on Delivery (COD)"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="payment-card"
                  name="paymentMethod"
                  label="Credit/Debit Card"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  disabled
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="payment-upi"
                  name="paymentMethod"
                  label="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  disabled
                />
              </Form>
              <Alert variant="info" className="mt-3">
                Note: Card and UPI payment options will be available soon.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          {/* Order Summary */}
          <Card>
            <Card.Header as="h5">Order Summary</Card.Header>
            <Card.Body>
              <h6 className="mb-3">Order Items</h6>
              {cart.items.map(item => (
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
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedAddress}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;