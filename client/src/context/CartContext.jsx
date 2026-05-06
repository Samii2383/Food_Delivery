import { useState } from "react";
import { CartContext } from "./CartContextObject";

const CART_KEY = "qb_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart());

  function persist(nextItems) {
    setItems(nextItems);
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
  }

  function addToCart(item) {
    const existing = items.find((x) => x.id === item.id);
    if (existing) {
      persist(items.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      persist([...items, { ...item, qty: 1 }]);
    }
  }

  function removeFromCart(id) {
    persist(items.filter((x) => x.id !== id));
  }

  function updateQuantity(id, qty) {
    if (qty <= 0) return removeFromCart(id);
    persist(items.map((x) => (x.id === id ? { ...x, qty } : x)));
  }

  function clearCart() {
    persist([]);
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const value = {
    items,
    subtotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

