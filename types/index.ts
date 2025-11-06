export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  measurements?: Measurements;
  createdAt: Date;
}

export interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  inseam?: number;
  height?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women' | 'accessories' | 'custom';
  subcategory: string;
  images: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
}

export interface Order {
  _id: string;
  user: string;
  products: {
    product: string;
    quantity: number;
    size?: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}


export interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  inseam?: number;
  height?: number;
  neck?: number;
  sleeve?: number;
  thigh?: number;
}

export interface MeasurementData {
  _id: string;
  user: string;
  measurements: Measurements;
  images?: string[];
  gender: 'male' | 'female';
  unit: 'cm' | 'inches';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}