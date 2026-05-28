"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAddItemToCartMutation, useGetCartQuery, useRemoveItemFromCartMutation, useUpdateCartItemQuantityMutation, useClearCartMutation } from "../services/cartApi";

export interface CartItem {
  id: string; // This will be cart item _id from backend
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: {
    size?: string;
    paperType?: string;
    colorTheme?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void; // This will be cart item _id from backend
  updateQuantity: (id: string, quantity: number) => void; // This will be cart item _id from backend
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { data: cartData, refetch, isLoading: isLoadingCart } = useGetCartQuery();
  const [addItemToCartMutation] = useAddItemToCartMutation();
  const [removeItemFromCartMutation] = useRemoveItemFromCartMutation();
  const [updateCartItemQuantityMutation] = useUpdateCartItemQuantityMutation();
  const [clearCartMutation] = useClearCartMutation();

  const items = cartData?.items.map((cartItem: any) => ({
    id: cartItem._id, // Map backend cart item _id to frontend item ID
    name: cartItem.product.name,
    price: cartItem.price,
    quantity: cartItem.quantity,
    image: cartItem.product.images?.[0] || "", // Assuming first image
    customization: cartItem.customization,
  })) || [];


  useEffect(() => {
    refetch();
  }, [refetch]);

  const addItem = async (item: CartItem) => {
    try {
      await addItemToCartMutation({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // Optionally, show a toast error
    }
  };

  const removeItem = async (id: string) => { // id here is the cart item _id from backend
    try {
      await removeItemFromCartMutation(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => { // id here is the cart item _id from backend
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }
    try {
      await updateCartItemQuantityMutation({ id, quantity }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update item quantity in cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartMutation().unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
