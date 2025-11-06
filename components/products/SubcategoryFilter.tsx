'use client';

import { Button } from '@/components/ui/button';
import { getSubcategories } from '@/lib/categories';
import { cn } from '@/lib/utils';

interface SubcategoryFilterProps {
  category: string;
  selectedSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

export default function SubcategoryFilter({
  category,
  selectedSubcategory,
  onSubcategoryChange,
}: SubcategoryFilterProps) {
  if (category === 'all') return null;

  const subcategories = getSubcategories(category);

  if (subcategories.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-3">Subcategories</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedSubcategory === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSubcategoryChange('')}
          className={cn(
            selectedSubcategory === '' && 'bg-zinc-500 hover:bg-zinc-500/90'
          )}
        >
          All
        </Button>
        {subcategories.map((sub) => (
          <Button
            key={sub.value}
            variant={selectedSubcategory === sub.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSubcategoryChange(sub.value)}
            className={cn(
              selectedSubcategory === sub.value &&
                'bg-zinc-500 hover:bg-zinc-500/90'
            )}
          >
            {sub.label}
          </Button>
        ))}
      </div>
    </div>
  );
}