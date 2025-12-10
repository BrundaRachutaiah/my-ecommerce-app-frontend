// src/components/common/Alert.js
import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const Alert = ({ variant, message, show, onClose }) => {
  return (
    show && (
      <BootstrapAlert variant={variant} className="position-fixed" 
        style={{ top: '70px', right: '20px', zIndex: '1050', minWidth: '300px' }}
        onClose={onClose} dismissible>
        {message}
      </BootstrapAlert>
    )
  );
};

export default Alert;