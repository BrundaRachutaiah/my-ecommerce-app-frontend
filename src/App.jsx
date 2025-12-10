// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';//./context/AuthContext
import { CartProvider } from './context/CartContext';//./context/CartContext
import { WishlistProvider } from './context/WishlistContext';//./context/WishlistContext
import { AlertProvider } from './context/AlertContext';//./context/AlertContext
import Header from './components/common/Header';//./components/common/Header
import Home from './pages/Home';//./pages/Home
import ProductListing from './pages/ProductListing';//./pages/ProductListing
import ProductDetail from './pages/ProductDetail';//./pages/ProductDetail
import Cart from './pages/Cart';//./pages/Cart
import Wishlist from './pages/Wishlist';//./pages/Wishlist
import Address from './pages/Address';//./pages/Address
import Checkout from './pages/Checkout';//./pages/Checkout
import Profile from './pages/Profile';//./pages/Profile
import Login from './pages/Login';//./pages/Login
import Register from './pages/Register';//./pages/Register
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/address" element={<Address />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;