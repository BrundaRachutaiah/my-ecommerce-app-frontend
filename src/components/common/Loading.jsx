// src/components/common/Loading.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{message}</span>
      </Spinner>
    </div>
  );
};

export default Loading;