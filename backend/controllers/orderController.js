const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { userEmail, items, address, totalPrice, paymentId } = req.body;
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 5); // 5 days delivery

    const formattedItems = items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image,
    }));

    const newOrder = new Order({
      userEmail,
      items: formattedItems,
      address,
      totalPrice,
      paymentId,
      arrivalDate,
    });

    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (err) {
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


