import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women' | 'accessories' | 'custom';
  subcategory: string;
  images: string[];
  sizes: string[];
  colors?: string[];
  inStock: boolean;
  featured: boolean;
  stock: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    category: {
      type: String,
      enum: ['men', 'women', 'accessories', 'custom'],
      required: [true, 'Category is required'],
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;