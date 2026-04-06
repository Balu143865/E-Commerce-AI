const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['view', 'search', 'add_to_cart', 'purchase', 'wishlist', 'review'],
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  searchQuery: String,
  category: String,
  metadata: {
    price: Number,
    quantity: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
activitySchema.index({ user: 1, activityType: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ product: 1, createdAt: -1 });

// Static method to log activity
activitySchema.statics.logActivity = async function(userId, type, data) {
  return await this.create({
    user: userId,
    activityType: type,
    product: data.productId || null,
    searchQuery: data.searchQuery || null,
    category: data.category || null,
    metadata: data.metadata || {}
  });
};

module.exports = mongoose.model('Activity', activitySchema);