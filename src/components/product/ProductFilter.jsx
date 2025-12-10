// src/components/product/ProductFilter.js
import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const ProductFilter = ({ 
  categories, 
  filters, 
  handleFilterChange, 
  clearFilters 
}) => {
  return (
    <Card className="mb-4 product-filter">
      <Card.Body>
        <h5 className="mb-3">Filters</h5>
        
        {/* Category Filter */}
        <div className="mb-4">
          <h6>Category</h6>
          <Form>
            {categories.map(category => (
              <Form.Check
                key={category._id}
                type="checkbox"
                id={`category-${category._id}`}
                label={category.name}
                checked={filters.category === category._id}
                onChange={() => handleFilterChange('category', 
                  filters.category === category._id ? '' : category._id
                )}
              />
            ))}
          </Form>
        </div>
        
        {/* Rating Filter */}
        <div className="mb-4">
          <h6>Rating</h6>
          <Form>
            {[4, 3, 2, 1].map(rating => (
              <Form.Check
                key={rating}
                type="radio"
                id={`rating-${rating}`}
                label={`${rating} Stars & Up`}
                name="rating"
                checked={filters.rating === rating.toString()}
                onChange={() => handleFilterChange('rating', rating.toString())}
              />
            ))}
          </Form>
        </div>
        
        {/* Sort Filter */}
        <div className="mb-4">
          <h6>Sort By</h6>
          <Form>
            <Form.Check
              type="radio"
              id="sort-price-low-high"
              label="Price: Low to High"
              name="sort"
              checked={filters.sort === 'price_low_high'}
              onChange={() => handleFilterChange('sort', 'price_low_high')}
            />
            <Form.Check
              type="radio"
              id="sort-price-high-low"
              label="Price: High to Low"
              name="sort"
              checked={filters.sort === 'price_high_low'}
              onChange={() => handleFilterChange('sort', 'price_high_low')}
            />
            <Form.Check
              type="radio"
              id="sort-rating"
              label="Rating: High to Low"
              name="sort"
              checked={filters.sort === 'rating_high_low'}
              onChange={() => handleFilterChange('sort', 'rating_high_low')}
            />
          </Form>
        </div>
        
        <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
          Clear Filters
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductFilter;