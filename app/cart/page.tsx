'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cartAPI, orderAPI } from '@/lib/api-client';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await cartAPI.getCart();
      setCartItems(cart);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const updated = await cartAPI.updateQuantity(productId, quantity);
      setCartItems(updated);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const updated = await cartAPI.removeFromCart(productId);
      setCartItems(updated);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    try {
      await orderAPI.createOrder(cartItems, total, address, paymentMethod);
      await cartAPI.clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Order placed successfully!');
      setShowCheckout(false);
      router.push('/orders');
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4 text-6xl">🛒</div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty!</h2>
            <p className="text-gray-500 mb-6">Add items to get started</p>
            <Button onClick={() => router.push('/')} className="bg-[#2874f0]">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Price Details</h2>

                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Price ({cartItems.length} items)
                    </span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-semibold py-6"
                  size="lg"
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Enter your delivery details to complete the order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">
                    Cash on Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="cursor-pointer">
                    UPI Payment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">
                    Credit/Debit Card
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-lg">₹{total.toLocaleString()}</span>
              </div>
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90"
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
