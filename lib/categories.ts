// lib/categories.ts
export const defaultCategories = {
  men: {
    label: "Men's Collection",
    icon: '👔',
    subcategories: [
      { value: 'suits', label: 'Suits' },
      { value: 'batakari', label: 'Batakari' },
      { value: 'shirts-long', label: 'Shirts (Long Sleeve)' },
      { value: 'shirts-short', label: 'Shirts (Short Sleeve)' },
      { value: 'round-neck', label: 'Round Neck Tops' },
      { value: 'ties', label: 'Ties' },
      { value: 'belts', label: 'Belts' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'slippers', label: 'Slippers' },
      { value: 'half-shoes', label: 'Half Shoes (Half Berg)' },
      { value: 'caps', label: 'Caps' },
    ],
  },
  women: {
    label: "Women's Collection",
    icon: '👗',
    subcategories: [
      { value: 'suits', label: 'Suits' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'slippers', label: 'Slippers' },
    ],
  },
  accessories: {
    label: 'Accessories',
    icon: '⌚',
    subcategories: [
      { value: 'watches', label: 'Watches' },
      { value: 'bracelets', label: 'Bracelets / Brooches' },
      { value: 'socks', label: 'Socks' },
      { value: 'suit-bags', label: 'Suit Bags' },
      { value: 'briefcases', label: 'Briefcases' },
    ],
  },
  custom: {
    label: 'Customization',
    icon: '🎨',
    subcategories: [
      { value: 'name-tags', label: 'Name Tag Customization' },
      { value: 'wall-frames', label: 'Wall Frames' },
    ],
  },
};

export async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Failed to fetch categories, using defaults');
      return defaultCategories;
    }
    
    const data = await response.json();
    
    if (data.categories && data.categories.length > 0) {
      const formatted: Record<string, any> = {};
      data.categories.forEach((cat: any) => {
        formatted[cat.key] = {
          label: cat.label,
          icon: cat.icon,
          subcategories: cat.subcategories,
        };
      });
      return formatted;
    }
    
    return defaultCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return defaultCategories;
  }
}


export function getCategoryLabel(category: string): string {
  return defaultCategories[category as keyof typeof defaultCategories]?.label || category;
}

export function getCategoryIcon(category: string): string {
  return defaultCategories[category as keyof typeof defaultCategories]?.icon || '📦';
}

export function getSubdefaultCategories(category: string) {
  return defaultCategories[category as keyof typeof defaultCategories]?.subcategories || [];
}