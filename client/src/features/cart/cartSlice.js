import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "qb_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart() },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const found = state.items.find((x) => x.id === item.id);
      if (found) found.qty += 1;
      else state.items.push({ ...item, qty: 1 });
      persistCart(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((x) => x.id !== action.payload);
      persistCart(state.items);
    },
    updateCartQuantity(state, action) {
      const { id, qty } = action.payload;
      const item = state.items.find((x) => x.id === id);
      if (!item) return;
      if (qty <= 0) {
        state.items = state.items.filter((x) => x.id !== id);
      } else {
        item.qty = qty;
      }
      persistCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      persistCart(state.items);
    }
  }
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
export const selectCartCount = (state) => state.cart.items.reduce((sum, x) => sum + x.qty, 0);
export const selectCartItems = (state) => state.cart.items;
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, x) => sum + x.price * x.qty, 0);

