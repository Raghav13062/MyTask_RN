import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
}

interface UserCart {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

interface CartState {
  userCarts: Record<string, UserCart>;
}

const initialState: CartState = {
  userCarts: {},
};

const getCart = (state: CartState, userId: string) => {
  if (!state.userCarts) state.userCarts = {};
  if (!state.userCarts[userId]) {
    state.userCarts[userId] = { items: [], totalPrice: 0, totalQuantity: 0 };
  }
  return state.userCarts[userId];
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ userId: string; id: number; productName: string; price: number }>) {
      const { userId, id, productName, price } = action.payload;
      const cart = getCart(state, userId);

      const existingItem = cart.items.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ id, productName, price, quantity: 1 });
      }

      cart.totalQuantity += 1;
      cart.totalPrice += price;
    },
    removeFromCart(state, action: PayloadAction<{ userId: string; id: number }>) {
      const { userId, id } = action.payload;
      const cart = getCart(state, userId);

      const existingItem = cart.items.find(item => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          cart.items = cart.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
        }
        cart.totalQuantity -= 1;
        cart.totalPrice -= existingItem.price;
      }
    },
    clearCart(state, action: PayloadAction<string>) {
      const userId = action.payload;
      const cart = getCart(state, userId);
      cart.items = [];
      cart.totalQuantity = 0;
      cart.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {},
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
