// models/Ad.ts
import mongoose, { Schema, Model } from 'mongoose';

export interface IAd {
  _id: string;
  title: string;
  description?: string;
  image: string;
  linkUrl: string;
  linkType: 'product' | 'category' | 'external';
  linkId?: string; // product ID or category key
  adType: 'banner' | 'sidebar' | 'popup' | 'inline';
  placement: 'homepage' | 'products' | 'product-detail' | 'cart' | 'all';
  isSponsored: boolean;
  priority: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  clicks: number;
  impressions: number;
  sponsorInfo?: {
    name: string;
    contact: string;
    amount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      required: true,
    },
    linkType: {
      type: String,
      enum: ['product', 'category', 'external'],
      default: 'product',
    },
    linkId: String,
    adType: {
      type: String,
      enum: ['banner', 'sidebar', 'popup', 'inline'],
      default: 'banner',
    },
    placement: {
      type: String,
      enum: ['homepage', 'products', 'product-detail', 'cart', 'all'],
      default: 'homepage',
    },
    isSponsored: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: Date,
    endDate: Date,
    clicks: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    sponsorInfo: {
      name: String,
      contact: String,
      amount: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Ad: Model<IAd> = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);
export default Ad;