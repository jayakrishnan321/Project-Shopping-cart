const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  address: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  paymentId: { type: String, required: true },
  status: { type: String, default: "Processing" },
  arrivalDate: { type: Date },
  supplier: {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    name: { type: String },
    email: { type: String },
    district: { type: String },
    place: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
