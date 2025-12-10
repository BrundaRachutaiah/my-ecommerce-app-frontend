// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useFetch from '../api/useFetch';//../api/useFetch
import Loading from '../components/common/Loading';//../components/common/Loading
import ProductCard from '../components/common/ProductCard';//../components/common/ProductCard

const Home = () => {
  const { data: categoriesData, loading: categoriesLoading } = useFetch('/api/categories');
  const { data: featuredProductsData, loading: productsLoading } = useFetch('/api/products?featured=true');

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">Welcome to MyShoppingSite</h1>
              <p className="lead">Discover amazing products at great prices</p>
              <Button as={Link} to="/products" variant="light" size="lg">
                Shop Now
              </Button>
            </Col>
            <Col md={6}>
              <div className="d-none d-md-block">
                <img src="https://picsum.photos/seed/shopping/600/400.jpg" alt="Shopping" className="img-fluid rounded" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Categories Section */}
      <Container className="mb-5">
        <h2 className="mb-4">Shop by Category</h2>
        {categoriesLoading ? (
          <Loading />
        ) : (
          <Row>
            {categoriesData?.data?.categories?.map(category => (
              <Col key={category._id} md={4} className="mb-4">
                <Card className="h-100 category-card">
                  <Card.Img variant="top" src={category.image || `https://picsum.photos/seed/${category.name}/400/250.jpg`} />
                  <Card.Body className="text-center">
                    <Card.Title>{category.name}</Card.Title>
                    <Card.Text>{category.description}</Card.Text>
                    <Button as={Link} to={`/products?category=${category._id}`} variant="primary">
                      Shop Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Featured Products Section */}
      <Container className="mb-5">
        <h2 className="mb-4">Featured Products</h2>
        {productsLoading ? (
          <Loading />
        ) : (
          <Row>
            {featuredProductsData?.data?.products?.slice(0, 4).map(product => (
              <Col key={product._id} md={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Newsletter Section */}
      <div className="bg-light py-5">
        <Container className="text-center">
          <h2 className="mb-4">Subscribe to Our Newsletter</h2>
          <p>Get the latest updates on new products and upcoming sales</p>
          <div className="d-flex justify-content-center">
            <div className="input-group" style={{ maxWidth: '500px' }}>
              <input type="email" className="form-control" placeholder="Your email address" />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;