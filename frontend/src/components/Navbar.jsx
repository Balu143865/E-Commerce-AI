import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ShopAI</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-orange-500 transition">
              Products
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/orders" className="text-gray-600 hover:text-orange-500 transition">
                  Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-orange-500 transition">
                    Admin
                  </Link>
                )}
              </>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-500 transition">
              <FiShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-500">
                  <FiUser size={20} />
                  <span>{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-orange-500">
                  Login
                </Link>
                <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </form>
            
            <div className="flex flex-col space-y-3">
              <Link 
                to="/products" 
                className="text-gray-600 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/orders" 
                    className="text-gray-600 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="text-center py-2 text-gray-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-center py-2 bg-orange-500 text-white rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;