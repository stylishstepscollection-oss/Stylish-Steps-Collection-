// models/Category.ts
import mongoose, { Schema, Model } from 'mongoose';

export interface ICategory {
  _id: string;
  key: string; // unique identifier
  label: string;
  icon: string;
  subcategories: Array<{
    value: string;
    label: string;
  }>;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '📦',
    },
    subcategories: [{
      value: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      }
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;