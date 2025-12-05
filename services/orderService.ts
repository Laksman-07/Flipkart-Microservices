import { CartItem } from './cartService';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  deliveryAddress: string;
  paymentMethod: string;
}

class OrderService {
  private storageKey = 'flipkart_orders';

  getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    const orders = localStorage.getItem(this.storageKey);
    return orders ? JSON.parse(orders) : [];
  }

  createOrder(
    items: CartItem[],
    total: number,
    deliveryAddress: string,
    paymentMethod: string
  ): Order {
    const order: Order = {
      id: Date.now().toString(),
      items,
      total,
      date: new Date().toISOString(),
      status: 'pending',
      deliveryAddress,
      paymentMethod,
    };

    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);

    return order;
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((order) => order.id === id);
  }

  updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === id);

    if (order) {
      order.status = status;
      this.saveOrders(orders);
    }

    return order;
  }

  private saveOrders(orders: Order[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
    }
  }
}

export const orderService = new OrderService();
