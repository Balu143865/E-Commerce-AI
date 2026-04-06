const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Activity = require('../models/Activity');
const { verifyToken } = require('../middleware/auth');

const matchesCartItem = (item, identifier) => {
  if (!identifier) {
    return false;
  }

  return (
    item._id.toString() === identifier ||
    item.product.toString() === identifier
  );
};

// Get cart
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId })
      .populate('items.product', 'name images price stock');

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [], totalAmount: 0 });
      await cart.save();
    }

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error fetching cart.' });
  }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock.' });
    }

    let cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();

    // Log add to cart activity
    await Activity.logActivity(req.userId, 'add_to_cart', {
      productId,
      category: product.category,
      metadata: { price: product.price, quantity }
    });

    // Populate product details
    await cart.populate('items.product', 'name images price stock');

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding to cart.' });
  }
});

// Update item quantity
router.put('/update/:itemId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(
      item => matchesCartItem(item, itemId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    // Check stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product && product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock.' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate('items.product', 'name images price stock');

    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error updating cart.' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      item => !matchesCartItem(item, itemId)
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price stock');

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing from cart.' });
  }
});

// Clear cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.userId },
      { items: [], totalAmount: 0 },
      { new: true }
    );

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error clearing cart.' });
  }
});

module.exports = router;
