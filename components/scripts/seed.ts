import connectDB from '@/lib/mongodb';
import Category from '@/models/Categories';
import { defaultCategories } from '@/lib/categories';

async function seedCategories() {
  try {
    await connectDB();
    
    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log('Categories already exist in database');
      return;
    }

    // Convert default categories to database format
    const categoriesToSeed = Object.entries(defaultCategories).map(([key, data], index) => ({
      key,
      label: data.label,
      icon: data.icon,
      subcategories: data.subcategories,
      isActive: true,
      order: index,
    }));

    await Category.insertMany(categoriesToSeed);
    console.log('Default categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

seedCategories();