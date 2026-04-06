import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    await onAddToCart(product._id);
    setAdding(false);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className={`card group relative bg-white rounded-xl overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg ring-2 ring-orange-500 ring-offset-2' : 'shadow-md border border-gray-100 hover:shadow-xl'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border gradient on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-xl opacity-20 pointer-events-none" />
      )}
      <Link to={`/products/${product._id}`}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
          
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}

          {/* Quick Actions */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-white text-gray-800 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50"
            >
              <FiShoppingCart />
              <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-orange-500 font-medium mb-1">{product.category}</p>
          <h3 className="text-gray-800 font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-500 transition">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  size={14}
                  fill={i < Math.floor(product.ratings?.average || 0) ? '#fbbf24' : 'none'}
                />
              ))}
            </div>
            <span className="text-gray-500 text-xs ml-2">({product.ratings?.count || 0})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 mt-1 block">
              {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
            </span>
          ) : (
            <span className="text-xs text-red-600 mt-1 block">Out of Stock</span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;