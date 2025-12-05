'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cartAPI } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const updateCartCount = async () => {
    try {
      const cart = await cartAPI.getCart();
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="bg-[#2874f0]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-white">
                <h1 className="text-2xl font-bold italic">Flipkart</h1>
                <p className="text-xs text-yellow-300">
                  Explore <span className="font-semibold">Plus</span>
                </p>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full pl-4 pr-12 py-5 rounded-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-0 top-0 h-full rounded-l-none bg-white hover:bg-gray-50"
                  variant="ghost"
                >
                  <Search className="h-5 w-5 text-[#2874f0]" />
                </Button>
              </div>
            </form>

            <div className="flex items-center gap-6">
              <Link
                href="/orders"
                className="flex items-center gap-2 text-white hover:opacity-80 transition"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Orders</span>
              </Link>

              <Link
                href="/cart"
                className="flex items-center gap-2 text-white hover:opacity-80 transition relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#2874f0] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
