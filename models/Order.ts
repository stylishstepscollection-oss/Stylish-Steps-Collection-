import mongoose, { Schema, Model } from 'mongoose';

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

export interface IOrder {
  _id: string;
  user: mongoose.Types.ObjectId | PopulatedUser;
  products: {
    product: mongoose.Types.ObjectId | PopulatedProduct;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingInfo: {
    phone: string;
    address: string;
    city: string;
  };
  notes?: string;
  statusHistory: {
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }[];
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  paymentMethod: string;
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
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingInfo: {
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
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
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentReference: String,
    paymentMethod: {
      type: String,
      default: 'paystack',
    },
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
      note: 'Order created',
    });
  }
  next();
});

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;