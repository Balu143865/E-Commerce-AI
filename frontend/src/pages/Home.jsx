import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiRefreshCw, FiShield } from 'react-icons/fi';
import { productAPI, recommendationAPI } from '../api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, recsRes] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 8 }),
          recommendationAPI.getPersonalized(8)
        ]);
        
        setFeaturedProducts(featuredRes.data.products);
        setRecommendations(recsRes.data.recommendations || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
  };

  const categories = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300', count: '200+' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300', count: '250+' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300', count: '150+' },
    { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', count: '100+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop Smart with AI-Powered Recommendations
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover products tailored just for you based on your preferences and browsing history.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <FiArrowRight />
              </Link>
              <Link 
                to="/products?featured=true" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition"
              >
                Featured Deals
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f5f6fa"/>
          </svg>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FiShoppingBag className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Free Shipping</h3>
              <p className="text-sm text-gray-500">On orders above ₹500</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FiRefreshCw className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Easy Returns</h3>
              <p className="text-sm text-gray-500">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FiShield className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              to={`/products?category=${cat.name}`}
              className="relative group overflow-hidden rounded-xl h-48"
            >
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">{cat.name}</h3>
                <p className="text-sm opacity-80">{cat.count} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products?featured=true" className="text-orange-500 hover:underline flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="container mx-auto px-4 pb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">AI</span>
            <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
          </div>
          <p className="text-gray-500 mb-4">Based on your browsing history and preferences</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.slice(0, 8).map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6 opacity-80">Get the latest updates on new products and upcoming sales</p>
          <form className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800"
            />
            <button className="bg-orange-500 px-6 py-3 rounded-r-lg font-semibold hover:bg-orange-600 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;