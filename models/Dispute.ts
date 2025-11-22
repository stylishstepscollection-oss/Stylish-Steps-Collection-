// models/Dispute.ts
import mongoose, { Schema, Model } from 'mongoose';

export interface IDispute {
  _id: string;
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: 'not_received' | 'damaged' | 'wrong_item' | 'quality_issue' | 'other';
  description: string;
  images?: string[];
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
  messages: {
    sender: mongoose.Types.ObjectId;
    message: string;
    timestamp: Date;
    isAdmin: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['not_received', 'damaged', 'wrong_item', 'quality_issue', 'other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [String],
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'closed'],
      default: 'open',
    },
    resolution: String,
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isAdmin: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Dispute: Model<IDispute> =
  mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);

export default Dispute;