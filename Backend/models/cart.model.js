import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'items.productType'
  },
  productType: {
    type: String,
    required: true,
    enum: ['Book', 'Quiz']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"],
    default: 1,
  }
});

const cartSchema = new Schema({
  belongTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [cartItemSchema],
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    default: null
  },
  subtotal: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Add methods to calculate totals
cartSchema.methods.calculateTotals = async function() {
  let subtotal = 0;
  
  for (const item of this.items) {
    const product = await mongoose.model(item.productType).findById(item.productId);
    if (product && product.price) {
      subtotal += product.price * item.quantity;
    }
  }
  
  this.subtotal = subtotal;
  this.total = this.coupon 
    ? subtotal - (subtotal * (this.coupon.discountPercentage / 100))
    : subtotal;
    
  return this.save();
};

export const Cart = mongoose.model("Cart", cartSchema);
