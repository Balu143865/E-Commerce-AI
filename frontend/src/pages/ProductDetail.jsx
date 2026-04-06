import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await productAPI.getOne(id);
      setProduct(res.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(id, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      setSubmittingReview(true);
      await productAPI.addReview(id, { rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewRating(5);
      fetchProduct(); // Refresh to show new review
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden mb-4">
                {product.images && product.images[activeImage] ? (
                  <img 
                    src={product.images[activeImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        activeImage === index ? 'border-orange-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-orange-500 font-medium mb-2">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      size={20}
                      fill={i < Math.floor(product.ratings?.average || 0) ? '#fbbf24' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-gray-500 ml-2">
                  {product.ratings?.average?.toFixed(1) || '0'} ({product.ratings?.count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">Save ₹{product.originalPrice - product.price}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Stock & Brand */}
              <div className="flex gap-4 mb-6 text-sm">
                {product.brand && (
                  <span className="text-gray-500">Brand: <span className="text-gray-800">{product.brand}</span></span>
                )}
                <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-300 flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiTruck />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiShield />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiRefreshCw />
                  <span className="text-sm">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
            
            {/* Add Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-xl mb-8">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-2xl"
                      >
                        <FiStar 
                          fill={star <= reviewRating ? '#fbbf24' : 'none'}
                          className={star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-500 font-medium">
                            {review.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            size={16}
                            fill={i < review.rating ? '#fbbf24' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;