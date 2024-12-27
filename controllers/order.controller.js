// server/controllers/order.controller.js

import Order from '../models/Order.js';
import User from '../models/User.js';
import axios from 'axios';

// Create order by fetching product details from Fake Store API
export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  try {
    // Fetch product details from Fake Store API
    const productRequests = items.map(item =>
      axios.get(`https://fakestoreapi.com/products/${item.productId}`)
    );
    const productResponses = await Promise.all(productRequests);
    const products = productResponses.map(response => response.data);

    // Map items with product details
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return {
        product: product.id,
        name: product.title,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // Calculate total amount
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount,
    });
    await order.save();

    // Update user's order history
    const user = await User.findById(req.user.id);
    user.orders.push(order._id);
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order', details: error.message });
  }
};

// Get user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};
// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
};