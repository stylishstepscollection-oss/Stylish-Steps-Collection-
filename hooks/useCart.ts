'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += 1;
          set({ items: newItems });
          toast.success('Quantity updated in cart');
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
          toast.success('Added to cart');
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.size === size &&
                item.color === color
              )
          ),
        });
        toast.success('Removed from cart');
      },

      updateQuantity: (productId, quantity, size, color) => {
        const items = get().items;
        const index = items.findIndex(
          (i) =>
            i.productId === productId && i.size === size && i.color === color
        );

        if (index > -1) {
          const newItems = [...items];
          if (quantity <= 0) {
            newItems.splice(index, 1);
          } else {
            newItems[index].quantity = quantity;
          }
          set({ items: newItems });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);