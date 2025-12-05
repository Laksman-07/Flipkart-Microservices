import { Product, products } from '@/data/products';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
  searchQuery?: string;
}

class ProductService {
  private products: Product[] = products;

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }

  filterProducts(filters: ProductFilters): Product[] {
    let filtered = [...this.products];

    if (filters.searchQuery) {
      filtered = this.searchProducts(filters.searchQuery);
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }

    return filtered;
  }

  getBrands(): string[] {
    const brands = new Set(this.products.map((p) => p.brand));
    return Array.from(brands).sort();
  }

  getFeaturedProducts(limit: number = 6): Product[] {
    return this.products
      .filter((p) => p.rating >= 4.3)
      .slice(0, limit);
  }
}

export const productService = new ProductService();
