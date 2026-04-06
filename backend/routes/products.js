const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Activity = require('../models/Activity');
const { verifyToken, optionalAuth, isAdmin } = require('../middleware/auth');

// Get all products (with filtering, search, pagination)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
      featured
    } = req.query;

    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'rating') sortOption = { 'ratings.average': -1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .select('-reviews');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
});

// Get single product
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Log view activity if user is authenticated
    if (req.userId) {
      await Activity.logActivity(req.userId, 'view', {
        productId: product._id,
        category: product.category
      });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
});

// Admin: Create product
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product.' });
  }
});

// Admin: Update product
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product.' });
  }
});

// Admin: Delete product
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
});

// Add review
router.post('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      r => r.user.toString() === req.userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    // Add review
    product.reviews.push({
      user: req.userId,
      rating,
      comment
    });

    // Update average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.ratings.average = totalRating / product.reviews.length;
    product.ratings.count = product.reviews.length;

    await product.save();

    // Log review activity
    await Activity.logActivity(req.userId, 'review', {
      productId: product._id,
      category: product.category
    });

    res.json({ message: 'Review added', product });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review.' });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;