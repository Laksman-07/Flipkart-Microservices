import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

class CartService {
  private storageKey = 'flipkart_cart';

  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: Product, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    this.saveCart(cart);
    return cart;
  }

  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item.product.id !== productId);
    this.saveCart(cart);
    return cart;
  }

  updateQuantity(productId: string, quantity: number): CartItem[] {
    const cart = this.getCart();
    const item = cart.find((item) => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      this.saveCart(cart);
    }

    return cart;
  }

  clearCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  getCartTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getCartItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCart(cart: CartItem[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
    }
  }
}

export const cartService = new CartService();
