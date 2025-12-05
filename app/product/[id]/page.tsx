'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productAPI, cartAPI } from '@/lib/api-client';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const id = params.id as string;
        const foundProduct = await productAPI.getById(id);
        setProduct(foundProduct);
      } catch (error) {
        console.error('Failed to load product:', error);
        router.push('/');
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await cartAPI.addToCart(product, quantity);
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success(`${quantity} item(s) added to cart`);
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      try {
        await cartAPI.addToCart(product, quantity);
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/cart');
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white font-semibold py-6"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-semibold py-6"
                    size="lg"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded font-medium">
                    {product.rating}
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="text-gray-600">
                    {product.reviews.toLocaleString()} ratings & reviews
                  </span>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-lg text-green-600 font-medium">
                          {product.discount}% off
                        </span>
                      </>
                    )}
                  </div>
                  {product.inStock ? (
                    <p className="text-green-600 font-medium">In Stock</p>
                  ) : (
                    <p className="text-red-600 font-medium">Out of Stock</p>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Brand</p>
                      <p className="font-medium">{product.brand}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Category</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
