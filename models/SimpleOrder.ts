import mongoose, { Document, Schema } from "mongoose";

export interface ISimpleOrder extends Document {
  products: any[];
  buyer: mongoose.Types.ObjectId;
  shippingInfo: any;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const SimpleOrderSchema = new Schema<ISimpleOrder>(
  {
    products: [Schema.Types.Mixed],
    buyer: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    shippingInfo: Schema.Types.Mixed,
    paymentMethod: {
      type: String,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "Processing"
    }
  },
  { timestamps: true }
);

export default mongoose.models.SimpleOrder || mongoose.model<ISimpleOrder>("SimpleOrder", SimpleOrderSchema);