// src/components/address/AddressList.js
import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import AddressForm from './AddressForm';
import { deleteAddress } from '../../api/apiService';//../../api/apiService
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext

const AddressList = ({ addresses, refreshAddresses }) => {
  const [showForm, setShowForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const { showAlert } = useAlert();

  const handleEdit = (address) => {
    setAddressToEdit(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        showAlert('success', 'Address deleted successfully');
        refreshAddresses();
      } catch (error) {
        showAlert('danger', error.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setAddressToEdit(null);
  };

  if (!addresses || addresses.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>No addresses found</h3>
        <p>Add your first address to get started with checkout</p>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Address
        </Button>
        <AddressForm 
          show={showForm} 
          handleClose={handleCloseForm} 
          refreshAddresses={refreshAddresses}
        />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Addresses</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add New Address
        </Button>
      </div>
      
      <Row>
        {addresses.map(address => (
          <Col key={address._id} md={6} className="mb-4">
            <Card className={`h-100 ${address.isDefault ? 'border-primary' : ''}`}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>
                  {address.name}
                  {address.isDefault && <Badge bg="primary" className="ms-2">Default</Badge>}
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
      
      <AddressForm 
        show={showForm} 
        handleClose={handleCloseForm} 
        addressToEdit={addressToEdit}
        refreshAddresses={refreshAddresses}
      />
    </>
  );
};

export default AddressList;