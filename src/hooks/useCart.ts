import { useEffect, useState, useCallback } from 'react';

export interface CartItem {
  cartId: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    slug?: string;
  };
  engravedName?: string;
  selectedFont?: string;
  selectedSymbol?: any;
  selectedSize?: string;
  quantity?: number;
  [k: string]: any;
}

const STORAGE_KEY = 'cart';
const EVENT_NAME = 'cart-updated';

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Backfill quantity for legacy items
    return parsed.map((i: any) => ({ ...i, quantity: i.quantity ?? 1 }));
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => readCart());

  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, 'cartId' | 'quantity'> & { quantity?: number }) => {
    const current = readCart();
    const newItem = { ...item, cartId: Date.now() + Math.random(), quantity: item.quantity ?? 1 } as CartItem;
    writeCart([...current, newItem]);
  }, []);

  const removeFromCart = useCallback((cartId: number) => {
    writeCart(readCart().filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: number, qty: number) => {
    if (qty < 1) return;
    writeCart(readCart().map((i) => (i.cartId === cartId ? { ...i, quantity: qty } : i)));
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const itemCount = cart.reduce((acc, i) => acc + (i.quantity ?? 1), 0);
  const subtotal = cart.reduce((acc, i) => {
    const price =
      typeof i.product.price === 'number'
        ? i.product.price
        : parseFloat(String(i.product.price).replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + price * (i.quantity ?? 1);
  }, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal };
}
