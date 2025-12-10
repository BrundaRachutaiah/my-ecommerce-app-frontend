// src/context/WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/apiService';//../api/apiService

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlist();
        setWishlist(response.data.wishlist);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const addItemToWishlist = async (productId) => {
    try {
      const response = await addToWishlist(productId);
      setWishlist(response.data.wishlist);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to wishlist' 
      };
    }
  };

  const removeItemFromWishlist = async (productId) => {
    try {
      const response = await removeFromWishlist(productId);
      setWishlist(response.data.wishlist);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item from wishlist' 
      };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      loading, 
      addItemToWishlist, 
      removeItemFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};