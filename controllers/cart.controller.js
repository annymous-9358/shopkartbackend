import User from '../models/User.js';

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const itemIndex = user.cart.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      // Update quantity if item already exists
      user.cart[itemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart', details: error.message });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart', details: error.message });
  }
};