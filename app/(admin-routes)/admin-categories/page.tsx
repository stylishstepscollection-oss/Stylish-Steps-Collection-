// app/admin-categories/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Categories';
import CategoriesManager from '@/components/admin/CategoriesManager';

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  await connectDB();
  const categories = await Category.find().sort({ order: 1 }).lean();
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
        <p className="text-muted-foreground">
          Create and manage product categories and subcategories
        </p>
      </div>
      <CategoriesManager initialCategories={serializedCategories} />
    </div>
  );
}