import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ProductCard from '../components/common/ProductCard';
import { getCategories, getProducts } from '../api/apiService';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const categoriesRes = await getCategories();
        const productsRes = await getProducts({ featured: true });

        setCategories(categoriesRes.categories || categoriesRes);
        setFeaturedProducts(productsRes.products || productsRes);
      } catch (error) {
        console.error('Home API error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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
              <img
                src="https://picsum.photos/seed/shopping/600/400"
                alt="Shopping"
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Categories */}
      <Container className="mb-5">
        <h2 className="mb-4">Shop by Category</h2>

        {loading ? (
          <Loading />
        ) : (
          <Row>
            {categories.map((category) => (
              <Col key={category._id} md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={
                      category.image ||
                      `https://picsum.photos/seed/${category.name}/400/250`
                    }
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{category.name}</Card.Title>
                    <Button
                      as={Link}
                      to={`/products?category=${category._id}`}
                      variant="primary"
                    >
                      Shop Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Featured Products */}
      <Container className="mb-5">
        <h2 className="mb-4">Featured Products</h2>

        {loading ? (
          <Loading />
        ) : (
          <Row>
            {featuredProducts.slice(0, 4).map((product) => (
              <Col key={product._id} md={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;
