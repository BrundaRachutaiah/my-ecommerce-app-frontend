// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';//../context/AuthContext
import { getOrders } from '../api/apiService';//../api/apiService
import { useAlert } from '../context/AlertContext';//../context/AlertContext
import Loading from '../components/common/Loading';//../components/common/Loading

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <Loading />;

  return (
    <Container className="py-4">
      <h1 className="mb-4">My Profile</h1>
      
      <Tabs defaultActiveKey="profile" id="profile-tabs" className="mb-4">
        <Tab eventKey="profile" title="Profile Information">
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header as="h5">Personal Information</Card.Header>
                <Card.Body>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td><strong>Name:</strong></td>
                        <td>{user?.name}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{user?.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Phone:</strong></td>
                        <td>{user?.phone || 'Not provided'}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Button variant="primary">Edit Profile</Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card>
                <Card.Header as="h5">Account Actions</Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" href="/address">
                      Manage Addresses
                    </Button>
                    <Button variant="outline-primary">
                      Change Password
                    </Button>
                    <Button variant="outline-danger">
                      Delete Account
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="orders" title="Order History">
          {orders.length === 0 ? (
            <div className="text-center py-5">
              <h3>No orders yet</h3>
              <p>You haven't placed any orders yet.</p>
              <Button variant="primary" href="/products">
                Start Shopping
              </Button>
            </div>
          ) : (
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
                          <span className="badge bg-success">Paid</span>
                        ) : (
                          <span className="badge bg-warning">Pending</span>
                        )}
                        {order.isDelivered && (
                          <span className="badge bg-info ms-1">Delivered</span>
                        )}
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;