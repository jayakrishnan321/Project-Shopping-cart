const Order = require("../models/Order");
const Supplier=require('../models/Supplier')


exports.createOrder = async (req, res) => {
  try {
    const { userEmail, items, address, totalPrice, paymentId } = req.body;

    // Set estimated arrival date (5 days from now)
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 5);

    // Extract place and district from address
    const addressParts = address.split(",").map((part) => part.trim());
    const place = addressParts[addressParts.length - 3] || "";
    const district = addressParts[addressParts.length - 2] || "";

    // Find the supplier for this location
    const supplier = await Supplier.findOne({
      place: new RegExp(`^${place}$`, "i"),   // Case-insensitive match
      district: new RegExp(`^${district}$`, "i"),
      status: "approved",
    });

    // ❌ If no supplier is found, return an error
    if (!supplier) {
      return res.status(400).json({
        success: false,
        message: `Sorry, we cannot deliver to ${place}, ${district} as no supplier is available.`,
      });
    }

    // Format order items
    const formattedItems = items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image,
    }));

    // Create order with supplier info
    const newOrder = new Order({
      userEmail,
      items: formattedItems,
      address,
      totalPrice,
      paymentId,
      arrivalDate,
      supplier: {
        supplierId: supplier._id,
        name: supplier.name,
        email: supplier.email,
        district: supplier.district,
        place: supplier.place,
      },
    });

    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: "Order creation failed", error: err });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


