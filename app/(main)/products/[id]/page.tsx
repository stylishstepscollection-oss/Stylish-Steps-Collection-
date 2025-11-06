import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductDetail from '@/components/products/ProductDetail';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params; // Await params
    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    return {
      title: `${product.name} | Stylish Style Collection`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: 'Product Not Found',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { id } = await params; // Await params
    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      notFound();
    }

    const serializedProduct = JSON.parse(JSON.stringify(product));
    return <ProductDetail product={serializedProduct} />;
  } catch (error) {
    notFound();
  }
}