import mongoose, { Schema, Model } from 'mongoose';

export interface IMeasurement {
  _id: string;
  user: mongoose.Types.ObjectId;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    shoulders?: number;
    inseam?: number;
    height?: number;
    neck?: number;
    sleeve?: number;
    thigh?: number;
  };
  images?: string[];
  gender: 'male' | 'female';
  unit: 'cm' | 'inches';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeasurementSchema = new Schema<IMeasurement>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      shoulders: Number,
      inseam: Number,
      height: Number,
      neck: Number,
      sleeve: Number,
      thigh: Number,
    },
    images: [String],
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

const Measurement: Model<IMeasurement> =
  mongoose.models.Measurement || mongoose.model<IMeasurement>('Measurement', MeasurementSchema);

export default Measurement;