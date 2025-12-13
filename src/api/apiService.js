// src/api/apiService.js
import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const API_URL = import.meta.env.VITE_API_URL;

// Get session ID from localStorage or create a new one
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Set up axios defaults
axios.defaults.headers.common['x-session-id'] = getSessionId();

// Products API
export const getProducts = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/products`, { params });
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await axios.get(`${API_URL}/api/products/${productId}`);
  return response.data;
};

// Categories API
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/api/categories`);
  return response.data;
};

// Cart API
export const getCart = async () => {
  const response = await axios.get(`${API_URL}/api/cart`);
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post(`${API_URL}/api/cart/add`, { productId, quantity });
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await axios.put(`${API_URL}/api/cart/update`, { productId, quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await axios.delete(`${API_URL}/api/cart/remove/${productId}`);
  return response.data;
};

// Wishlist API
export const getWishlist = async () => {
  const response = await axios.get(`${API_URL}/api/wishlist`);
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axios.post(`${API_URL}/api/wishlist/add`, { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await axios.delete(`${API_URL}/api/wishlist/remove/${productId}`);
  return response.data;
};

// Address API
export const getAddresses = async () => {
  const response = await axios.get(`${API_URL}/api/addresses`);
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await axios.post(`${API_URL}/api/addresses/add`, addressData);
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await axios.put(`${API_URL}/api/addresses/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await axios.delete(`${API_URL}/api/addresses/${addressId}`);
  return response.data;
};

// Orders API
export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/api/orders`);
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/api/orders/${orderId}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/api/orders`, orderData);
  return response.data;
};

// User API
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/register`, userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/api/users/profile`);
  return response.data;
};