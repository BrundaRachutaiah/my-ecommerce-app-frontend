// src/components/checkout/CheckoutForm.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { getAddresses } from '../../api/apiService';//../../api/apiService
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext

const CheckoutForm = ({ selectedAddress, setSelectedAddress, paymentMethod, setPaymentMethod }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

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

  return (
    <>
      {/* Delivery Address Section */}
      <Card className="mb-4">
        <Card.Header as="h5">Delivery Address</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-3">
              <p>You haven't added any addresses yet.</p>
              <Button variant="primary" href="/address">
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
              <Button variant="outline-primary" href="/address">
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
    </>
  );
};

export default CheckoutForm;