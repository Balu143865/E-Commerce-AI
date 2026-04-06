import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const NewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products?limit=12');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            New Arrivals
          </h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewProducts;