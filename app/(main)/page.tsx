import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/productCard';
import { categories } from '@/lib/categories';
import { HeroCarousel } from '@/components/home/heroCarousel';
export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  await connectDB();

  // Fetch featured products
  const featuredProducts = await Product.find({ featured: true, inStock: true })
    .limit(4)
    .lean();

  // Get product counts by category
  const productCounts = await Promise.all(
    Object.keys(categories).map(async (category) => {
      const count = await Product.countDocuments({ category, inStock: true });
      return { category, count };
    })
  );

  const serializedProducts = JSON.parse(JSON.stringify(featuredProducts));

  
  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative w-full overflow-hidden">
        <HeroCarousel/>
      </section>

      {/* Welcome Message */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {session.user.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Explore our latest collection
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Button variant="ghost" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categories).map(([key, category]) => {
            const categoryCount = productCounts.find((c) => c.category === key);
            return (
              <Link
                key={key}
                href={`/products?category=${key}`}
                className="group p-6 bg-card border rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {categoryCount?.count || 0} items
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      {serializedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="ghost" asChild>
              <Link href="/products?featured=true">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serializedProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card border rounded-2xl text-center">
            <div className="text-4xl mb-3">📏</div>
            <h3 className="font-semibold mb-2">AI Measurements</h3>
            <p className="text-sm text-muted-foreground">
              Get accurate body measurements using our AI technology
            </p>
          </div>
          <div className="p-6 bg-card border rounded-2xl text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold mb-2">Direct Contact</h3>
            <p className="text-sm text-muted-foreground">
              Chat with sellers via WhatsApp, Snapchat, or Instagram
            </p>
          </div>
          <div className="p-6 bg-card border rounded-2xl text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold mb-2">Customization</h3>
            <p className="text-sm text-muted-foreground">
              Personalize your items with custom name tags and designs
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}