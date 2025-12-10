// src/components/product/ProductDetail.js
import React, { useState } from 'react';
import { Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';//../../context/CartContext
import { useWishlist } from '../../context/WishlistContext';//../../context/WishlistContext
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const { addItemToCart } = useCart();
  const { addItemToWishlist, removeItemFromWishlist, isInWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showAlert('warning', 'Please select a size');
      return;
    }

    const result = await addItemToCart(product._id, quantity);
    showAlert(result.success ? 'success' : 'danger', result.message);
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist(product._id)) {
      const result = await removeItemFromWishlist(product._id);
      showAlert(result.success ? 'success' : 'danger', result.message);
    } else {
      const result = await addItemToWishlist(product._id);
      showAlert(result.success ? 'success' : 'danger', result.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    
    return stars;
  };

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        {renderStars(product.rating)}
        <span className="ms-2">({product.numReviews} reviews)</span>
      </div>
      
      <div className="d-flex align-items-center mb-3">
        <h3 className="text-primary me-3">{formatPrice(product.price)}</h3>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-decoration-line-through text-muted me-2">
              {formatPrice(product.originalPrice)}
            </span>
            <Badge bg="danger">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Badge>
          </>
        )}
      </div>
      
      <p className="mb-4">{product.description}</p>
      
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-4">
          <h5>Select Size:</h5>
          <div className="d-flex flex-wrap">
            {product.sizes.map(size => (
              <Button
                key={size}
                variant={selectedSize === size ? "primary" : "outline-secondary"}
                className="me-2 mb-2"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h5>Quantity:</h5>
        <Form.Select
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          style={{ width: '100px' }}
        >
          {[...Array(Math.min(10, product.countInStock))].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </Form.Select>
      </div>
      
      <div className="d-flex mb-4">
        <Button
          variant="primary"
          size="lg"
          className="me-3"
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        <Button
          variant={isInWishlist(product._id) ? "danger" : "outline-secondary"}
          size="lg"
          onClick={handleWishlistToggle}
        >
          {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
      </div>
      
      <Row className="mt-4">
        <Col md={6}>
          <div className="mb-4">
            <h5>Category:</h5>
            <span>{product.category?.name}</span>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-4">
            <h5>Availability:</h5>
            <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
            </span>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProductDetail;