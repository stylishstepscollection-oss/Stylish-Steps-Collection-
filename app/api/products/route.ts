    import { NextRequest, NextResponse } from 'next/server';
    import connectDB from '@/lib/mongodb';
    import Product from '@/models/Product';
    import { getServerSession } from 'next-auth';
    import { authOptions } from '@/lib/auth';


export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = { inStock: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search && search.trim()) {
      // Improved fuzzy search
      const searchTerms = search.trim().split(/\s+/);
      const searchRegexes = searchTerms.map(
        term => new RegExp(term, 'i')
      );

      query.$or = [
        // Exact name match (highest priority)
        { name: { $regex: search, $options: 'i' } },
        // Partial name match
        ...searchRegexes.map(regex => ({ name: regex })),
        // Description match
        { description: { $regex: search, $options: 'i' } },
        // Tags match
        { tags: { $in: searchRegexes } },
        // Subcategory match
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort({ 
        // Sort by featured first, then by creation date
        featured: -1,
        createdAt: -1 
      })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

    // POST /api/products - Create new product (Admin only)
    export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const {
        name,
        description,
        price,
        category,
        subcategory,
        images,
        sizes,
        colors,
        stock,
        featured,
        tags,
        } = body;

        // Validation
        if (!name || !description || !price || !category || !subcategory) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
        }

        const product = await Product.create({
        name,
        description,
        price,
        category,
        subcategory,
        images: images || [],
        sizes: sizes || [],
        colors: colors || [],
        stock: stock || 0,
        inStock: stock > 0,
        featured: featured || false,
        tags: tags || [],
        });

        return NextResponse.json(
        { message: 'Product created successfully', product },
        { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json(
        { error: error.message || 'Failed to create product' },
        { status: 500 }
        );
    }
    }