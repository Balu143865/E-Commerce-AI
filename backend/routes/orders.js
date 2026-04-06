const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Activity = require('../models/Activity');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Place order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Check stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Product ${product?.name || 'Unknown'} is out of stock.` 
        });
      }

      subtotal += item.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: item.price,
        quantity: item.quantity
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above 500
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const totalAmount = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      notes
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    // Log purchase activity
    for (const item of orderItems) {
      await Activity.logActivity(req.userId, 'purchase', {
        productId: item.product,
        metadata: { price: item.price, quantity: item.quantity }
      });
    }

    res.status(201).json({ 
      message: 'Order placed successfully', 
      order 
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error placing order.' });
  }
});

// Get user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.userId });

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
});

// Get single order
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order.' });
  }
});

// Admin: Get all orders
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
});

// Admin: Update order status
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        orderStatus,
        deliveredAt: orderStatus === 'delivered' ? Date.now() : order.deliveredAt,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order.' });
  }
});

// Admin: Update payment status
router.put('/:id/payment', verifyToken, isAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error updating payment.' });
  }
});

module.exports = router;