import ProductForm from '@/components/admin/productForm';

export default function NewProductPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product listing</p>
      </div>
      <ProductForm />
    </div>
  );
}