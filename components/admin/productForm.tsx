'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { categories, getSubcategories } from '@/lib/categories';
import { IProduct } from '@/models/Product';

interface ProductFormProps {
  product?: IProduct;
  isEdit?: boolean;
}

type CategoryKey = "men" | "women" | "accessories" | "custom";

interface FormDataState {
  name: string;
  description: string;
  price: number;
  category: CategoryKey; // Use the specific union type
  subcategory: string;
  stock: number;
  featured: boolean;
  sizes: string;
  colors: string;
  tags: string;
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: (product?.category || 'men') as CategoryKey,
    subcategory: product?.subcategory || '',
    stock: product?.stock || 0,
    featured: product?.featured || false,
    sizes: product?.sizes?.join(', ') || '',
    colors: product?.colors?.join(', ') || '',
    tags: product?.tags?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const url = isEdit ? `/api/products/${product?._id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const subcategories = getSubcategories(formData.category);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData,category: value as CategoryKey, subcategory: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory *</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured">Featured</Label>
              <Select
                value={formData.featured.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, featured: value === 'true' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sizes">Sizes (comma-separated)</Label>
            <Input
              id="sizes"
              placeholder="S, M, L, XL"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colors">Colors (comma-separated)</Label>
            <Input
              id="colors"
              placeholder="Black, White, Navy"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="formal, casual, premium"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-zinc-500 hover:bg-zinc-500/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : isEdit ? (
                'Update Product'
              ) : (
                'Create Product'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}