// src/pages/ProductListing.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';//../components/common/ProductCard
import Loading from '../components/common/Loading';//../components/common/Loading
import { getProducts, getCategories } from '../api/apiService';//../api/apiService
import { useAlert } from '../context/AlertContext';//../context/AlertContext

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    rating: searchParams.get('rating') || 0,
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (filters.category) params.category = filters.category;
        if (filters.rating) params.rating = filters.rating;
        if (filters.sort) params.sort = filters.sort;
        if (filters.search) params.search = filters.search;
        
        const response = await getProducts(params);

const productsArray = Array.isArray(response.products)
  ? response.products
  : Array.isArray(response)
  ? response
  : [];

setProducts(productsArray);

      } catch (error) {
        showAlert('danger', 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();

const categoriesArray = Array.isArray(response.categories)
  ? response.categories
  : Array.isArray(response)
  ? response
  : [];

setCategories(categoriesArray);

      } catch (error) {
        showAlert('danger', 'Failed to fetch categories');
      }
    };

    fetchProducts();
    fetchCategories();
  }, [filters, showAlert]);

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.search) params.set('search', filters.search);
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      rating: 0,
      sort: '',
      search: ''
    });
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Products</h1>
      
      <Row>
        {/* Filters Sidebar */}
        <Col md={3} className="mb-4">
          <div className="bg-light p-3 rounded">
            <h5 className="mb-3">Filters</h5>
            
            {/* Category Filter */}
            <div className="mb-4">
              <h6>Category</h6>
              <Form>
                {Array.isArray(categories) && categories.map(category => (
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
          </div>
        </Col>
        
        {/* Products Grid */}
        <Col md={9}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-5">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <Row>
                  {Array.isArray(products) && products.map(product => (
                    <Col key={product._id} md={4} className="mb-4">
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListing;