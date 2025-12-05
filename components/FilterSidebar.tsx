'use client';

import { categories } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all"
                checked={selectedCategory === ''}
                onCheckedChange={() => onCategoryChange('')}
              />
              <Label htmlFor="all" className="text-sm cursor-pointer">
                All Categories
              </Label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategory === category}
                  onCheckedChange={() => onCategoryChange(category)}
                />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            max={150000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Customer Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={minRating.toString()} onValueChange={(v) => onRatingChange(Number(v))}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="rating-all" />
                <Label htmlFor="rating-all" className="text-sm cursor-pointer">
                  All Ratings
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="rating-4" />
                <Label htmlFor="rating-4" className="text-sm cursor-pointer">
                  4★ & above
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4.3" id="rating-4.3" />
                <Label htmlFor="rating-4.3" className="text-sm cursor-pointer">
                  4.3★ & above
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4.5" id="rating-4.5" />
                <Label htmlFor="rating-4.5" className="text-sm cursor-pointer">
                  4.5★ & above
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
