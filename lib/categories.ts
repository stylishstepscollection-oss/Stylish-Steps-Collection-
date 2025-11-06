export const categories = {
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

export function getCategoryLabel(category: string): string {
  return categories[category as keyof typeof categories]?.label || category;
}

export function getCategoryIcon(category: string): string {
  return categories[category as keyof typeof categories]?.icon || '📦';
}

export function getSubcategories(category: string) {
  return categories[category as keyof typeof categories]?.subcategories || [];
}