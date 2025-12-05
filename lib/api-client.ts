// Base URLs dynamically read from environment variables or fallback to localhost for local dev
const API_BASE_URLS = {
  product: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3001',
  cart: process.env.NEXT_PUBLIC_CART_SERVICE_URL || 'http://localhost:3002',
  order: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3003',
};

// Helper to get a user ID (same as before)
export const getUserId = () => {
  if (typeof window === 'undefined') return 'default-user';
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user-${Date.now()}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// -------- Product API --------
export const productAPI = {
  async getAll() {
    const res = await fetch(`${API_BASE_URLS.product}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getById(id: string) {
    const res = await fetch(`${API_BASE_URLS.product}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async search(query: string) {
    const res = await fetch(`${API_BASE_URLS.product}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async filter(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    searchQuery?: string;
  }) {
    const res = await fetch(`${API_BASE_URLS.product}/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    if (!res.ok) throw new Error('Filter failed');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE_URLS.product}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getBrands() {
    const res = await fetch(`${API_BASE_URLS.product}/brands`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },
};

// -------- Cart API --------
export const cartAPI = {
  async getCart() {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.cart}/cart/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  async addToCart(product: any, quantity: number = 1) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.cart}/cart/${userId}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, quantity }),
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
  },

  async removeFromCart(productId: string) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.cart}/cart/${userId}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error('Failed to remove from cart');
    return res.json();
  },

  async updateQuantity(productId: string, quantity: number) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.cart}/cart/${userId}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) throw new Error('Failed to update quantity');
    return res.json();
  },

  async clearCart() {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.cart}/cart/${userId}/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    return res.json();
  },

  async getTotal() {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.cart}/cart/${userId}/total`);
    if (!res.ok) throw new Error('Failed to get total');
    return res.json();
  },
};

// -------- Order API --------
export const orderAPI = {
  async getOrders() {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.order}/orders/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(items: any[], total: number, deliveryAddress: string, paymentMethod: string) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.order}/orders/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total, deliveryAddress, paymentMethod }),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async getOrderById(orderId: string) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.order}/orders/${userId}/${orderId}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: string) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URLS.order}/orders/${userId}/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },
};
