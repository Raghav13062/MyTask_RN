import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ id: number; productName: string; price: number }>) {
      const { id, productName, price } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, productName, price, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalPrice += price;
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
        }
        state.totalQuantity -= 1;
        state.totalPrice -= existingItem.price;
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    // Clear cart automatically when user logs out
    builder.addCase('auth/logout', (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
