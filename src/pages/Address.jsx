// src/pages/Address.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../api/apiService';//../api/apiService
import { useAlert } from '../context/AlertContext';//../context/AlertContext
import Loading from '../components/common/Loading';//../components/common/Loading

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data.addresses);
    } catch (error) {
      showAlert('danger', 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const response = await updateAddress(editingAddress._id, formData);
        showAlert('success', response.data.message);
      } else {
        const response = await addAddress(formData);
        showAlert('success', response.data.message);
      }
      
      fetchAddresses();
      handleCloseModal();
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault || false
    });
    setShowModal(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await deleteAddress(addressId);
        showAlert('success', response.data.message);
        fetchAddresses();
      } catch (error) {
        showAlert('danger', error.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false
    });
  };

  if (loading) return <Loading />;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Addresses</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-5">
          <h3>No addresses found</h3>
          <p>Add your first address to get started with checkout</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Address
          </Button>
        </div>
      ) : (
        <Row>
          {addresses.map(address => (
            <Col key={address._id} md={6} className="mb-4">
              <Card className={`h-100 ${address.isDefault ? 'border-primary' : ''}`}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>
                    {address.name}
                    {address.isDefault && <span className="badge bg-primary ms-2">Default</span>}
                  </span>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(address)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(address._id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="mb-1">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="mb-1">{address.addressLine2}</p>}
                  <p className="mb-1">{address.city}, {address.state} {address.postalCode}</p>
                  <p className="mb-1">{address.country}</p>
                  <p className="mb-0">Phone: {address.phone}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Address Form Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAddress ? 'Edit Address' : 'Add New Address'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Address Line 2 (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isDefault"
                label="Set as default address"
                checked={formData.isDefault}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Address;