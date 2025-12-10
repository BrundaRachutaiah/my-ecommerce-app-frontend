// src/components/wishlist/WishlistItem.js
import React from 'react';
import { Card, Button, Badge, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';//../../context/WishlistContext
import { useCart } from '../../context/CartContext';//../../context/CartContext
import { useAlert } from '../../context/AlertContext';//../../context/AlertContext

const WishlistItem = ({ item }) => {
  const { removeItemFromWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const { showAlert } = useAlert();

  const handleRemoveFromWishlist = async () => {
    const result = await removeItemFromWishlist(item._id);
    showAlert(result.success ? 'success' : 'danger', result.message);
  };

  const handleAddToCart = async () => {
    try {
      const result = await addItemToCart(item._id);
      if (result.success) {
        await removeItemFromWishlist(item._id);
        showAlert('success', 'Item added to cart and removed from wishlist');
      } else {
        showAlert('danger', result.message);
      }
    } catch (error) {
      showAlert('danger', error.message || 'Failed to add item to cart');
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
    <Card className="h-100 wishlist-item">
      <Link to={`/products/${item._id}`} className="text-decoration-none">
        <div className="position-relative overflow-hidden">
          <Card.Img variant="top" src={item.image} alt={item.name} />
          {item.discount > 0 && (
            <div className="position-absolute top-0 end-0 m-2">
              <span className="badge bg-danger">{item.discount}% OFF</span>
            </div>
          )}
        </div>
      </Link>
      <Card.Body className="d-flex flex-column">
        <Card.Title as="div">
          <Link to={`/products/${item._id}`} className="text-decoration-none text-dark">
            <strong>{item.name}</strong>
          </Link>
        </Card.Title>
        <Card.Text as="div" className="mb-2">
          <div className="d-flex align-items-center">
            {renderStars(item.rating)}
            <span className="ms-2 text-muted">({item.numReviews})</span>
          </div>
        </Card.Text>
        <Card.Text as="div" className="mb-3">
          <div className="d-flex align-items-center">
            <span className="h5 mb-0">{formatPrice(item.price)}</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-decoration-line-through text-muted ms-2">
                {formatPrice(item.originalPrice)}
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
            variant="outline-danger"
            className="w-100"
            onClick={handleRemoveFromWishlist}
          >
            Remove from Wishlist
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WishlistItem;