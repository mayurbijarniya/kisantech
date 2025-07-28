import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  buyer: mongoose.Types.ObjectId;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentMethod: string;
  paymentInfo: any;
  totalAmount: number;
  status: string;
  payment: {
    method: string;
    status: string;
    amount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    shippingInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String }
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'upi', 'cod'],
      required: true
    },
    paymentInfo: {
      type: Schema.Types.Mixed
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    },
    payment: {
      method: { type: String, required: true },
      status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      },
      amount: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

// Indexes
OrderSchema.index({ buyer: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);