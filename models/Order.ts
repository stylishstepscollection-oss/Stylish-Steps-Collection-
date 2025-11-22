// models/Order.ts
import mongoose, { Schema, Model } from 'mongoose';

// Add a populated user interface
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

// Add a populated product interface
interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

export interface IOrder {
  _id: string;
  user: mongoose.Types.ObjectId | PopulatedUser; // Can be either ObjectId or populated
  products: {
    product: mongoose.Types.ObjectId | PopulatedProduct; // Can be either ObjectId or populated
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }[];
  total: number;
  status: 'draft' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  contactMethod: 'whatsapp' | 'snapchat' | 'instagram';
  contactInfo: string;
  notes?: string;
  statusHistory: {
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }[];
  externalConversationId?: string;
  draftExpiresAt?: Date;
  externalOrderId?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cancellationReason?: string;
  cancelledBy?: 'user' | 'admin';
  cancelledAt?: Date;
  deliveredAt?: Date;
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
      enum: ['draft', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'draft',
    },
    contactMethod: {
      type: String,
      enum: ['whatsapp', 'snapchat', 'instagram'],
      required: true,
    },
    contactInfo: {
      type: String,
      required: false,
      default: '',
    },
    notes: String,
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    externalConversationId: String,
    draftExpiresAt: Date,
    externalOrderId: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    cancellationReason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'admin'],
    },
    cancelledAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: this.status === 'draft' ? 'Draft order created' : 'Order created',
    });
  }
  next();
});

OrderSchema.index({ status: 1, draftExpiresAt: 1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;