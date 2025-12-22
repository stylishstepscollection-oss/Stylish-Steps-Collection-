// app/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Categories';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroCarousel } from '@/components/home/heroCarousel';
import VideoTutorial from '@/components/home/videoTutorial';
import HelpButton from '@/components/home/HelpButton';
import { CategoryProductCarousel } from '@/components/home/CategoryProductCarousel';
import { IProduct } from '@/models/Product';
import AdBanner from '@/components/ads/AdBanner';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  await connectDB();

  // Fetch categories from database
  const dbCategories = await Category.find({ isActive: true })
    .sort({ order: 1 })
    .lean();

  const categories: Record<string, any> = {};
  dbCategories.forEach((cat: any) => {
    categories[cat.key] = {
      label: cat.label,
      icon: cat.icon,
      subcategories: cat.subcategories,
    };
  });

  // If no categories in DB, use defaults
  if (Object.keys(categories).length === 0) {
    const { defaultCategories } = await import('@/lib/categories');
    Object.assign(categories, defaultCategories);
  }

  // Fetch featured products
  const featuredProducts = await Product.find({ 
    featured: true, 
    inStock: true 
  })
    .limit(12)
    .lean();

  const featuredIds = featuredProducts.map(p => p._id.toString());

  // Fetch new arrivals (last 12 products, excluding featured)
  const newArrivals = await Product.find({ 
    inStock: true,
    _id: { $nin: featuredIds }
  })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  const newArrivalIds = newArrivals.map(p => p._id.toString());
  const excludedIds = [...featuredIds, ...newArrivalIds];

  // Fetch products by category (excluding featured and new arrivals)
  const categoryProducts: Record<string, IProduct[]> = {};
  
  for (const categoryKey of Object.keys(categories)) {
    const products = await Product.find({ 
      category: categoryKey, 
      inStock: true,
      _id: { $nin: excludedIds }
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();
    
    if (products.length > 0) {
      categoryProducts[categoryKey] = products as IProduct[];
    }
  }

  // Get product counts by category for the category cards
  const productCounts = await Promise.all(
    Object.keys(categories).map(async (category) => {
      const count = await Product.countDocuments({ category, inStock: true });
      return { category, count };
    })
  );

  // Serialize for client components
  const serializedFeaturedProducts = JSON.parse(JSON.stringify(featuredProducts)) as IProduct[];
  const serializedNewArrivals = JSON.parse(JSON.stringify(newArrivals)) as IProduct[];
  const serializedCategoryProducts = JSON.parse(JSON.stringify(categoryProducts)) as Record<string, IProduct[]>;

  // Check if user is new (within 7 days of registration)
  const isNewUser = session?.user?.createdAt
    ? new Date().getTime() - new Date(session.user.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative w-full overflow-hidden">
        <HeroCarousel />
      </section>

      {/* Top Banner Ad */}
      <section className="container mx-auto px-4 pt-8">
        <AdBanner placement="homepage" adType="banner" />
      </section>

      {/* Welcome Message */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          {session ? (
            <>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {session.user.name}! 👋
              </h2>
              <p className="text-muted-foreground">
                Explore our latest collection
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-2">
                Welcome to Stylish Steps Collection! 👋
              </h2>
              <p className="text-muted-foreground">
                Browse our collection or{' '}
                <Link href="/register" className="text-accent-gold hover:underline font-medium">
                  sign up
                </Link>{' '}
                to get started
              </p>
            </>
          )}
        </div>
      </section>

      {/* Video Tutorial */}
      {session && isNewUser && <VideoTutorial />}
      {session && <HelpButton />}

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Shop by Category</h2>
            <p className="text-sm text-muted-foreground">Browse our curated collections</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categories).map(([key, category]) => {
            const categoryCount = productCounts.find((c) => c.category === key);
            return (
              <Link
                key={key}
                href={`/products?category=${key}`}
                className="group p-6 bg-card border rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1 hover:border-accent-gold"
              >
                <div className="text-5xl mb-3 transition-transform group-hover:scale-110">
                  {category.icon}
                </div>
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
      {serializedFeaturedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">✨ Featured Products</h2>
              <p className="text-sm text-muted-foreground">Hand-picked items just for you</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products?featured=true" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <CategoryProductCarousel products={serializedFeaturedProducts} />
        </section>
      )}

      {/* Inline Ad after Featured Products */}
      <section className="container mx-auto px-4">
        <AdBanner placement="homepage" adType="inline" />
      </section>

      {/* New Arrivals */}
      {serializedNewArrivals.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">🆕 New Arrivals</h2>
              <p className="text-sm text-muted-foreground">Fresh styles just in</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <CategoryProductCarousel products={serializedNewArrivals} />
        </section>
      )}

      {/* Category-Specific Product Sections */}
      {Object.entries(serializedCategoryProducts).length > 0 && (
        <>
          {(Object.entries(serializedCategoryProducts) as [string, IProduct[]][]).map(([categoryKey, products], index) => {
            if (products.length === 0) return null;
            
            const category = categories[categoryKey];
            if (!category) return null;

            return (
              <div key={categoryKey}>
                <section className="container mx-auto px-4 py-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Explore our {category.label.toLowerCase()}
                      </p>
                    </div>
                    <Button variant="ghost" asChild>
                      <Link href={`/products?category=${categoryKey}`} className="group">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                  <CategoryProductCarousel products={products} />
                </section>
                
                {/* Add inline ad after every 2 category sections */}
                {(index + 1) % 2 === 0 && (
                  <section className="container mx-auto px-4">
                    <AdBanner placement="homepage" adType="inline" />
                  </section>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Video Tutorial for returning users */}
      {session && !isNewUser && <VideoTutorial />}

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-12 bg-muted/30 rounded-3xl my-8">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Stylish Steps Collection</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card border rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="font-semibold mb-2">Easy Shopping</h3>
            <p className="text-sm text-muted-foreground">
              Seamless shopping experience with secure checkout and multiple payment options
            </p>
          </div>
          <div className="p-6 bg-card border rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">📏</div>
            <h3 className="font-semibold mb-2">AI Measurements</h3>
            <p className="text-sm text-muted-foreground">
              Get accurate body measurements using our advanced AI technology for perfect fit
            </p>
          </div>
          <div className="p-6 bg-card border rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold mb-2">Customization</h3>
            <p className="text-sm text-muted-foreground">
              Personalize your items with custom name tags, embroidery, and unique designs
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Banner Ad */}
      <section className="container mx-auto px-4 pb-8">
        <AdBanner placement="homepage" adType="banner" />
      </section>
    </div>
  );
}