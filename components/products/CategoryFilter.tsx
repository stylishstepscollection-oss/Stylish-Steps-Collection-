'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { categories, getCategoryIcon } from '@/lib/categories';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('all')}
          className={cn(
            selectedCategory === 'all' && 'bg-zinc-500 hover:bg-zinc-500/90'
          )}
        >
          All Products
        </Button>
        {Object.entries(categories).map(([key, category]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(key)}
            className={cn(
              selectedCategory === key && 'bg-zinc-500 hover:bg-zinc-500/90'
            )}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}