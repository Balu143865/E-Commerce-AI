const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Activity = require('../models/Activity');
const { verifyToken, optionalAuth } = require('../middleware/auth');

// Content-based filtering: Get recommendations based on user's browsing history
router.get('/content-based', optionalAuth, async (req, res) => {
  try {
    let recommendations = [];
    const limit = Number(req.query.limit) || 8;

    if (req.userId) {
      // Get user's recent activity
      const recentActivities = await Activity.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('product', 'category tags');

      // Extract categories and tags from viewed products
      const viewedCategories = new Set();
      const viewedTags = new Set();

      recentActivities.forEach(activity => {
        if (activity.product) {
          if (activity.product.category) viewedCategories.add(activity.product.category);
          if (activity.product.tags) {
            activity.product.tags.forEach(tag => viewedTags.add(tag));
          }
        }
      });

      // Find products matching viewed categories and tags
      const query = {
        isActive: true,
        _id: { $nin: recentActivities.map(a => a.product?._id).filter(Boolean) }
      };

      // First priority: Same category products
      const categoryProducts = await Product.find({
        ...query,
        category: { $in: Array.from(viewedCategories) }
      })
        .sort({ 'ratings.average': -1, createdAt: -1 })
        .limit(limit);

      recommendations = [...categoryProducts];

      // Fill with tag-matched products if needed
      if (recommendations.length < limit) {
        const remaining = limit - recommendations.length;
        const tagProducts = await Product.find({
          ...query,
          tags: { $in: Array.from(viewedTags) },
          _id: { $nin: recommendations.map(p => p._id) }
        })
          .sort({ 'ratings.average': -1 })
          .limit(remaining);

        recommendations = [...recommendations, ...tagProducts];
      }
    }

    // If no recommendations, return popular products
    if (recommendations.length === 0) {
      recommendations = await Product.find({ isActive: true })
        .sort({ 'ratings.average': -1, createdAt: -1 })
        .limit(limit);
    }

    res.json({ recommendations });
  } catch (error) {
    console.error('Content-based recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching recommendations.' });
  }
});

// Collaborative filtering: Get recommendations based on similar users
router.get('/collaborative', verifyToken, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const userId = req.userId;

    // Get products the user has interacted with
    const userActivities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const viewedProductIds = userActivities
      .filter(a => a.product)
      .map(a => a.product.toString());

    // Find other users who viewed the same products
    const similarUsers = await Activity.aggregate([
      {
        $match: {
          product: { $in: viewedProductIds.map(id => require('mongoose').Types.ObjectId.createFromHexString(id)) },
          user: { $ne: require('mongoose').Types.ObjectId.createFromHexString(userId.toString()) }
        }
      },
      {
        $group: {
          _id: '$user',
          commonProducts: { $addToSet: '$product' }
        }
      },
      {
        $addFields: {
          similarity: { $size: '$commonProducts' }
        }
      },
      { $sort: { similarity: -1 } },
      { $limit: 10 }
    ]);

    if (similarUsers.length === 0) {
      // Fallback to popular products
      const products = await Product.find({ isActive: true })
        .sort({ 'ratings.average': -1, createdAt: -1 })
        .limit(limit);
      return res.json({ recommendations: products, source: 'popular' });
    }

    // Get products that similar users interacted with but user hasn't
    const similarUserIds = similarUsers.map(s => s._id);
    
    const recommendations = await Activity.aggregate([
      {
        $match: {
          user: { $in: similarUserIds },
          product: { $nin: viewedProductIds.map(id => require('mongoose').Types.ObjectId.createFromHexString(id)) }
        }
      },
      {
        $group: {
          _id: '$product',
          score: { $sum: 1 }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit }
    ]);

    // Populate product details
    const productIds = recommendations.map(r => r._id);
    const products = await Product.find({ _id: { $in: productIds } })
      .limit(limit);

    res.json({ 
      recommendations: products,
      source: 'collaborative'
    });
  } catch (error) {
    console.error('Collaborative recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching recommendations.' });
  }
});

// Recently viewed products
router.get('/recently-viewed', verifyToken, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const activities = await Activity.find({ 
      user: req.userId,
      activityType: 'view',
      product: { $ne: null }
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    const productIds = activities.map(a => a.product);
    const products = await Product.find({ 
      _id: { $in: productIds },
      isActive: true 
    });

    // Maintain order
    const productMap = {};
    products.forEach(p => productMap[p._id.toString()] = p);
    const orderedProducts = productIds
      .map(id => productMap[id.toString()])
      .filter(Boolean);

    res.json({ products: orderedProducts });
  } catch (error) {
    console.error('Recently viewed error:', error);
    res.status(500).json({ message: 'Server error fetching recently viewed.' });
  }
});

// Log search activity for recommendations
router.post('/log-search', optionalAuth, async (req, res) => {
  try {
    const { query, category } = req.body;

    if (req.userId) {
      await Activity.logActivity(req.userId, 'search', {
        searchQuery: query,
        category
      });
    }

    res.json({ message: 'Search logged' });
  } catch (error) {
    console.error('Log search error:', error);
    res.status(500).json({ message: 'Server error logging search.' });
  }
});

// Get personalized recommendations (combined approach)
router.get('/personalized', optionalAuth, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;

    if (!req.userId) {
      // For non-authenticated users, return popular products
      const products = await Product.find({ isActive: true })
        .sort({ isFeatured: -1, 'ratings.average': -1, createdAt: -1 })
        .limit(limit);
      return res.json({ recommendations: products, personalized: false });
    }

    // Content-based: Products from recently viewed categories
    const recentActivities = await Activity.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('product', 'category tags');

    const categories = new Set();
    recentActivities.forEach(a => {
      if (a.category) categories.add(a.category);
      else if (a.product?.category) categories.add(a.product.category);
    });

    // Get products user hasn't viewed
    const viewedProducts = recentActivities
      .filter(a => a.product)
      .map(a => a.product._id);

    // Find products in similar categories with high ratings
    let recommendations = await Product.find({
      isActive: true,
      _id: { $nin: viewedProducts },
      category: { $in: Array.from(categories) }
    })
      .sort({ 'ratings.average': -1, isFeatured: -1 })
      .limit(limit);

    // If not enough, add popular products
    if (recommendations.length < limit) {
      const remaining = limit - recommendations.length;
      const viewedIds = recommendations.map(p => p._id);
      
      const popular = await Product.find({
        isActive: true,
        _id: { $nin: [...viewedProducts, ...viewedIds] }
      })
        .sort({ 'ratings.average': -1, isFeatured: -1 })
        .limit(remaining);

      recommendations = [...recommendations, ...popular];
    }

    res.json({ recommendations, personalized: true });
  } catch (error) {
    console.error('Personalized recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching personalized recommendations.' });
  }
});

module.exports = router;