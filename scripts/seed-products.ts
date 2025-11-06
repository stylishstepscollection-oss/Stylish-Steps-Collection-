import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://herbie:naruto.herbie@cluster0.9o3rqbo.mongodb.net/stylish-style?retryWrites=true&w=majority";

const sampleProducts = [
  // Men's Collection
  {
    name: 'Premium Business Suit',
    description: 'Crafted from premium wool blend, perfect for professional meetings and formal events.',
    price: 299,
    category: 'men',
    subcategory: 'suits',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Charcoal'],
    inStock: true,
    stock: 15,
    featured: true,
    tags: ['formal', 'business', 'premium'],
  },
  {
    name: 'Traditional Batakari',
    description: 'Authentic Ghanaian Batakari with intricate embroidery and traditional patterns.',
    price: 129,
    category: 'men',
    subcategory: 'batakari',
    images: [
      'https://images.unsplash.com/photo-1622519407650-3df9883f76e8?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Blue', 'Green', 'Brown'],
    inStock: true,
    stock: 20,
    featured: true,
    tags: ['traditional', 'cultural', 'handmade'],
  },
  {
    name: 'Oxford Leather Shoes',
    description: 'Classic oxford shoes made from genuine leather. Perfect for formal occasions.',
    price: 189,
    category: 'men',
    subcategory: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800',
      'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=800'
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Black', 'Brown'],
    inStock: true,
    stock: 12,
    featured: false,
    tags: ['formal', 'leather', 'shoes'],
  },
  {
    name: 'Casual Round Neck Top',
    description: 'Comfortable cotton round neck top for everyday wear.',
    price: 45,
    category: 'men',
    subcategory: 'round-neck',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray', 'Navy'],
    inStock: true,
    stock: 30,
    featured: false,
    tags: ['casual', 'cotton', 'everyday'],
  },
  {
    name: 'Silk Designer Tie',
    description: 'Elegant silk tie with modern patterns. Made from 100% silk.',
    price: 35,
    category: 'men',
    subcategory: 'ties',
    images: [
      'https://images.unsplash.com/photo-1589756823695-278bc8b47f86?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1611329532992-0f2e4e8defc8?w=800'
    ],
    sizes: ['One Size'],
    colors: ['Red', 'Blue', 'Gold', 'Green'],
    inStock: true,
    stock: 25,
    featured: false,
    tags: ['formal', 'silk', 'accessory'],
  },

  // Women's Collection
  {
    name: 'Elegant Evening Dress',
    description: 'Stunning evening dress perfect for special occasions. Features elegant draping and premium fabric.',
    price: 249,
    category: 'women',
    subcategory: 'suits',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red', 'Navy', 'Emerald'],
    inStock: true,
    stock: 10,
    featured: true,
    tags: ['formal', 'evening', 'elegant'],
  },
  {
    name: 'Classic High Heels',
    description: 'Timeless high heel shoes that combine comfort with style.',
    price: 159,
    category: 'women',
    subcategory: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800'
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Black', 'Nude', 'Red'],
    inStock: true,
    stock: 18,
    featured: false,
    tags: ['formal', 'heels', 'elegant'],
  },
  {
    name: 'Designer Slippers',
    description: 'Comfortable designer slippers for indoor and casual wear.',
    price: 65,
    category: 'women',
    subcategory: 'slippers',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800'
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Pink', 'White', 'Black'],
    inStock: true,
    stock: 22,
    featured: false,
    tags: ['casual', 'comfort', 'indoor'],
  },

  // Accessories
  {
    name: 'Luxury Watch',
    description: 'Swiss-inspired luxury watch with stainless steel band and water resistance.',
    price: 399,
    category: 'accessories',
    subcategory: 'watches',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'
    ],
    sizes: ['One Size'],
    colors: ['Silver', 'Gold', 'Black'],
    inStock: true,
    stock: 8,
    featured: true,
    tags: ['luxury', 'timepiece', 'elegant'],
  },
  {
    name: 'Leather Briefcase',
    description: 'Professional leather briefcase with multiple compartments and laptop sleeve.',
    price: 159,
    category: 'accessories',
    subcategory: 'briefcases',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'
    ],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    inStock: true,
    stock: 14,
    featured: false,
    tags: ['professional', 'leather', 'business'],
  },
  {
    name: 'Designer Bracelet Set',
    description: 'Set of 3 elegant bracelets perfect for any occasion.',
    price: 75,
    category: 'accessories',
    subcategory: 'bracelets',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800'
    ],
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    inStock: true,
    stock: 20,
    featured: false,
    tags: ['jewelry', 'accessory', 'elegant'],
  },
  {
    name: 'Premium Dress Socks',
    description: 'Comfortable dress socks made from premium cotton blend.',
    price: 25,
    category: 'accessories',
    subcategory: 'socks',
    images: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Gray', 'White'],
    inStock: true,
    stock: 50,
    featured: false,
    tags: ['formal', 'everyday', 'comfort'],
  },

  // Custom
  {
    name: 'Custom Name Tag',
    description: 'Personalized name tag for your clothing. Choose your design and text.',
    price: 15,
    category: 'custom',
    subcategory: 'name-tags',
    images: [
      'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800',
      'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800',
      'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800'
    ],
    sizes: ['Small', 'Medium', 'Large'],
    colors: ['Gold', 'Silver', 'Black'],
    inStock: true,
    stock: 100,
    featured: false,
    tags: ['custom', 'personalized', 'embroidery'],
  },
  {
    name: 'Custom Wall Frame',
    description: 'Personalized wall frame with your choice of design and message.',
    price: 85,
    category: 'custom',
    subcategory: 'wall-frames',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
      'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800',
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800'
    ],
    sizes: ['8x10', '11x14', '16x20'],
    colors: ['Black', 'White', 'Wood', 'Gold'],
    inStock: true,
    stock: 30,
    featured: false,
    tags: ['custom', 'decor', 'personalized'],
  },
];
async function seedProducts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const productsCollection = db.collection('products');

    // Clear existing products (optional)
    await productsCollection.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const result = await productsCollection.insertMany(sampleProducts);
    console.log(`Inserted ${result.insertedCount} products`);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedProducts();
