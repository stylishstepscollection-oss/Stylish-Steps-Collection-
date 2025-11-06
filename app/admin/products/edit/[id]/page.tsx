import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductForm from '@/components/admin/productForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();

    if (!product) {
      notFound();
    }

    const serializedProduct = JSON.parse(JSON.stringify(product));

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>
        <ProductForm product={serializedProduct} isEdit />
      </div>
    );
  } catch (error) {
    notFound();
  }
}