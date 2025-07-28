import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  type: string[]; // ['sell', 'rent'] - can be both
  salePrice?: number;
  rentalPrice?: number;
  rentalUnit?: string; // 'per day', 'per week', 'per month'
  rentalAvailability?: {
    from: Date;
    to: Date;
  };
  category: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  quantity: number;
  photo?: {
    data: Buffer;
    contentType: string;
  };
  shipping: boolean;
  availabilityStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: [String],
      enum: ['sell', 'rent'],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'Product must be available for sale or rent'
      }
    },
    salePrice: {
      type: Number,
      required: function(this: IProduct) {
        return this.type.includes('sell');
      }
    },
    rentalPrice: {
      type: Number,
      required: function(this: IProduct) {
        return this.type.includes('rent');
      }
    },
    rentalUnit: {
      type: String,
      enum: ['per day', 'per week', 'per month'],
      required: function(this: IProduct) {
        return this.type.includes('rent');
      }
    },
    rentalAvailability: {
      from: {
        type: Date,
        required: function(this: IProduct) {
          return this.type.includes('rent');
        }
      },
      to: {
        type: Date,
        required: function(this: IProduct) {
          return this.type.includes('rent');
        }
      }
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'unavailable', 'out_of_stock'],
      default: 'available'
    },
  },
  { timestamps: true }
);

// Indexes for better performance
ProductSchema.index({ createdAt: -1 }); // Most important for sorting
ProductSchema.index({ availabilityStatus: 1, createdAt: -1 }); // Compound index for filtering + sorting
ProductSchema.index({ category: 1, createdAt: -1 }); // For category filtering + sorting
ProductSchema.index({ type: 1, createdAt: -1 }); // For type filtering + sorting
ProductSchema.index({ seller: 1, createdAt: -1 }); // For seller products
ProductSchema.index({ name: "text", description: "text" }); // Text search
ProductSchema.index({ salePrice: 1 });
ProductSchema.index({ rentalPrice: 1 });

export default mongoose.models.Products || mongoose.model<IProduct>("Products", ProductSchema);