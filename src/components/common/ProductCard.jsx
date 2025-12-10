// src/components/common/ProductCard.js
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';//../../context/CartContext
import { useWishlist } from '../../context/WishlistContext';//../../context/WishlistContext
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart();
  const { addItemToWishlist, removeItemFromWishlist, isInWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const handleAddToCart = async () => {
    const result = await addItemToCart(product._id);
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
    <Card className="h-100 product-card">
      <Link to={`/products/${product._id}`} className="text-decoration-none">
        <div className="position-relative overflow-hidden">
          <Card.Img variant="top" src={product.image} alt={product.name} className="product-image" />
          {product.discount > 0 && (
            <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
      </Link>
      <Card.Body className="d-flex flex-column">
        <Card.Title as="div" className="product-title">
          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
            <strong>{product.name}</strong>
          </Link>
        </Card.Title>
        <Card.Text as="div" className="mb-2">
          <div className="d-flex align-items-center">
            {renderStars(product.rating)}
            <span className="ms-2 text-muted">({product.numReviews})</span>
          </div>
        </Card.Text>
        <Card.Text as="div" className="mb-3">
          <div className="d-flex align-items-center">
            <span className="h5 mb-0">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </Card.Text>
        <div className="mt-auto">
          <Button 
            variant="primary" 
            className="w-100 mb-2" 
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button 
            variant={isInWishlist(product._id) ? "danger" : "outline-secondary"} 
            className="w-100" 
            onClick={handleWishlistToggle}
          >
            {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;