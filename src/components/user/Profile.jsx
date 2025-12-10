// src/components/user/Profile.js
import React, { useState } from 'react';
import { Card, Button, Form, Tabs, Tab, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';//../../context/AuthContext
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext

const Profile = () => {
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Here you would typically call an API to update the user profile
    // For now, we'll just show a success message
    showAlert('success', 'Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    showAlert('success', 'Logged out successfully');
  };

  return (
    <Card className="profile-card">
      <Card.Header as="h4">My Profile</Card.Header>
      <Card.Body>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          <Tab eventKey="profile" title="Profile Information">
            {isEditing ? (
              <Form onSubmit={handleSaveProfile}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                
                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit">Save Changes</Button>
                  <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                </div>
              </Form>
            ) : (
              <div>
                <Row className="mb-3">
                  <Col md={3}><strong>Name:</strong></Col>
                  <Col md={9}>{user?.name}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3}><strong>Email:</strong></Col>
                  <Col md={9}>{user?.email}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3}><strong>Phone:</strong></Col>
                  <Col md={9}>{user?.phone || 'Not provided'}</Col>
                </Row>
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </Tab>
          
          <Tab eventKey="security" title="Security">
            <div className="mb-4">
              <h5>Change Password</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Button variant="primary">Update Password</Button>
              </Form>
            </div>
            
            <div className="mb-4">
              <h5>Account Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" href="/address">
                  Manage Addresses
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
                <Button variant="danger">
                  Delete Account
                </Button>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default Profile;