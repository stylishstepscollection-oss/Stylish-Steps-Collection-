'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import SubcategoryFilter from '@/components/products/SubcategoryFilter';
import SearchBar from '@/components/products/SearchBar';
import { IProduct } from '@/models/Product';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [subcategory, setSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Update category from URL params
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory('');
    // Update URL without navigation
    window.history.pushState({}, '', `/products${newCategory !== 'all' ? `?category=${newCategory}` : ''}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Our Products</h1>
        <p className="text-muted-foreground">
          Discover our premium collection of clothing and accessories
        </p>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <div className="mb-6">
        <CategoryFilter
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div className="mb-6">
        <SubcategoryFilter
          category={category}
          selectedSubcategory={subcategory}
          onSubcategoryChange={setSubcategory}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </div>
          <ProductGrid products={products} />
        </>
      )}
    </div>
  );
}