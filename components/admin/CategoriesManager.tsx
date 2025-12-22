// components/admin/CategoriesManager.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { ICategory } from '@/models/Categories';

interface CategoriesManagerProps {
  initialCategories: ICategory[];
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    key: '',
    label: '',
    icon: '📦',
    subcategories: [{ value: '', label: '' }],
  });

  const resetForm = () => {
    setFormData({
      key: '',
      label: '',
      icon: '📦',
      subcategories: [{ value: '', label: '' }],
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: ICategory) => {
    setEditingCategory(category);
    setFormData({
      key: category.key,
      label: category.label,
      icon: category.icon,
      subcategories: category.subcategories.length > 0 
        ? [...category.subcategories] // Create a copy to avoid mutation
        : [{ value: '', label: '' }],
    });
    setIsDialogOpen(true);
  };

  const addSubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { value: '', label: '' }],
    });
  };

  const removeSubcategory = (index: number) => {
    if (formData.subcategories.length === 1) {
      toast.error('Category must have at least one subcategory');
      return;
    }
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index),
    });
  };

  const updateSubcategory = (index: number, field: 'value' | 'label', value: string) => {
    const updated = [...formData.subcategories];
    updated[index][field] = value;
    setFormData({ ...formData, subcategories: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate
      if (!formData.key || !formData.label) {
        toast.error('Key and label are required');
        return;
      }

      // Filter out empty subcategories and validate
      const validSubcategories = formData.subcategories.filter(
        sub => sub.value.trim() && sub.label.trim()
      );

      if (validSubcategories.length === 0) {
        toast.error('At least one valid subcategory is required');
        return;
      }

      const payload = {
        key: formData.key,
        label: formData.label,
        icon: formData.icon,
        subcategories: validSubcategories,
      };

      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      toast.success(
        editingCategory ? 'Category updated successfully' : 'Category created successfully'
      );

      // Refresh categories
      await fetchCategories();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all products using this category.')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      toast.success('Category updated');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Categories</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-zinc-500 hover:bg-zinc-500/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory 
                      ? 'Update category details and manage subcategories' 
                      : 'Create a new category with subcategories for organizing products'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="key">
                        Key * <span className="text-xs text-muted-foreground">(URL-friendly)</span>
                      </Label>
                      <Input
                        id="key"
                        value={formData.key}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            key: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                          })
                        }
                        placeholder="e.g., sports-gear"
                        required
                        disabled={!!editingCategory}
                      />
                      {editingCategory && (
                        <p className="text-xs text-muted-foreground">Key cannot be changed after creation</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="label">Display Label *</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="e.g., Sports Gear"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="📦"
                      maxLength={2}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Subcategories *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSubcategory}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Subcategory
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {formData.subcategories.map((sub, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="flex-1 space-y-1">
                            <Input
                              placeholder="Value (e.g., running-shoes)"
                              value={sub.value}
                              onChange={(e) =>
                                updateSubcategory(index, 'value', e.target.value.toLowerCase().replace(/\s+/g, '-'))
                              }
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Input
                              placeholder="Label (e.g., Running Shoes)"
                              value={sub.label}
                              onChange={(e) => updateSubcategory(index, 'label', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSubcategory(index)}
                            disabled={formData.subcategories.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-zinc-500 hover:bg-zinc-500/90">
                      {isLoading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{category.key}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {sub.label}
                        </Badge>
                      ))}
                      {category.subcategories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.subcategories.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(category._id, category.isActive)}
                    >
                      <Badge variant={category.isActive ? 'default' : 'secondary'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}