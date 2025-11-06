'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setWishlist(data.products?.map((p: any) => p._id) || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setWishlist((prev) => [...prev, productId]);
      toast.success('Added to wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      setWishlist((prev) => prev.filter((id) => id !== productId));
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };
}