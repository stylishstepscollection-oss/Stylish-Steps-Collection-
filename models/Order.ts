import mongoose, { Schema, Model } from 'mongoose';

export interface IOrder {
  _id: string;
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  contactMethod: 'whatsapp' | 'snapchat' | 'instagram';
  contactInfo: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: String,
        color: String,
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    contactMethod: {
      type: String,
      enum: ['whatsapp', 'snapchat', 'instagram'],
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;