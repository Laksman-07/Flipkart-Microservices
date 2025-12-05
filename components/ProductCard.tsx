'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cartAPI } from '@/lib/api-client';
import { toast } from 'sonner';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await cartAPI.addToCart(product);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>

            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                {product.rating}
                <Star className="h-3 w-3 fill-current" />
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews.toLocaleString()})
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white font-medium"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
