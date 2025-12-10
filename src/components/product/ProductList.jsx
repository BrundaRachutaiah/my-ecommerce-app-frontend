// src/components/product/ProductList.js
import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import ProductCard from '../common/ProductCard';//../common/ProductCard
import Loading from '../common/Loading';//../common/Loading

const ProductList = ({ products, loading }) => {
  if (loading) {
    return <Loading />;
  }

  if (!products || products.length === 0) {
    return (
      <Alert variant="info" className="text-center py-5">
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms</p>
      </Alert>
    );
  }

  return (
    <Row>
      {products.map(product => (
        <Col key={product._id} md={4} className="mb-4">
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;