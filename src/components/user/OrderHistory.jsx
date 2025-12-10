// src/components/user/OrderHistory.js
import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { getOrders } from '../../api/apiService';//../../api/apiService
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext
import Loading from '../common/Loading';//../common/Loading

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      showAlert('danger', 'Failed to fetch order history');
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (!orders || orders.length === 0) {
    return (
      <Alert variant="info" className="text-center py-5">
        <h3>No orders yet</h3>
        <p>You haven't placed any orders yet.</p>
        <Button variant="primary" href="/products">
          Start Shopping
        </Button>
      </Alert>
    );
  }

  return (
    <>
      <Card className="order-history">
        <Card.Header as="h4">Order History</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatPrice(order.totalPrice)}</td>
                    <td>
                      {order.isPaid ? (
                        <Badge bg="success">Paid</Badge>
                      ) : (
                        <Badge bg="warning">Pending</Badge>
                      )}
                      {order.isDelivered && (
                        <Badge bg="info" className="ms-1">Delivered</Badge>
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Card className="mt-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>Order Details</h5>
            <Button variant="outline-secondary" size="sm" onClick={handleCloseOrderDetails}>
              Close
            </Button>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              </Col>
              <Col md={6}>
                <p><strong>Payment Status:</strong> {selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
                <p><strong>Delivery Status:</strong> {selectedOrder.isDelivered ? 'Delivered' : 'Pending'}</p>
                {selectedOrder.isDelivered && (
                  <p><strong>Delivery Date:</strong> {formatDate(selectedOrder.deliveredAt)}</p>
                )}
              </Col>
            </Row>
            
            <h6 className="mb-3">Order Items</h6>
            <div className="table-responsive">
              <Table striped>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            <div className="mt-3">
              <h6>Shipping Address</h6>
              <p>
                {selectedOrder.shippingAddress.name}<br />
                {selectedOrder.shippingAddress.addressLine1}<br />
                {selectedOrder.shippingAddress.addressLine2 && (
                  <>
                    {selectedOrder.shippingAddress.addressLine2}<br />
                  </>
                )}
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                {selectedOrder.shippingAddress.country}<br />
                Phone: {selectedOrder.shippingAddress.phone}
              </p>
            </div>
            
            <div className="mt-3 text-end">
              <h5>Total: {formatPrice(selectedOrder.totalPrice)}</h5>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default OrderHistory;