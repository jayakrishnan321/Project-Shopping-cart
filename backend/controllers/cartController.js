const Cart = require("../models/Cart");

const addcart= async (req, res) => {
  const { email, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userEmail: email });

    if (!cart) {
      cart = new Cart({ userEmail: email, items: [{ productId, quantity: 1 }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    cart.updatedAt = new Date();
    await cart.save();
    res.json({ success: true, message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
};
const getcart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userEmail: req.params.email }).populate('items.productId');

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { 'items._id': itemId },
      { $inc: { 'items.$.quantity': 1 } },
      { new: true }
    ).populate('items.productId');

    if (!cart) return res.status(404).json({ message: 'Cart item not found' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error increasing quantity' });
  }
};
const decreaseQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ 'items._id': itemId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId);

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      item.remove(); // remove item from array
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.productId');

    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: 'Error decreasing quantity' });
  }
};

module.exports={
    addcart,
    getcart,
    increaseQuantity,
  decreaseQuantity
}