import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ className = '' }) => {
  return (
    <footer className={`bg-gray-900 text-gray-300 ${className}`}>
      {/* Main Footer - Links Section */}
      <div className="border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Get Started */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider pb-2 border-b border-amber-500 inline-block">
                Get Started
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Shop Now
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider pb-2 border-b border-amber-500 inline-block">
                Shop
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/products?category=Men" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Men's Fashion
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Women" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Women's Fashion
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Electronics" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Accessories" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Footwear" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Footwear
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider pb-2 border-b border-amber-500 inline-block">
                Support
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Track Order
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider pb-2 border-b border-amber-500 inline-block">
                About
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 hover:ml-1 transition-all duration-200 block">
                    Sustainability
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider pb-2 border-b border-amber-500 inline-block">
                Connect With Us
              </h4>
              <div className="space-y-4 text-sm mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 3V3z"/>
                    </svg>
                  </div>
                  <span className="text-gray-400">1-800-123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <span className="text-gray-400">support@shopsmart.com</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-gray-900 transition-all duration-200 group">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-gray-900 transition-all duration-200 group">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-gray-900 transition-all duration-200 group">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.61 3.43-1.69 1.32-3.83 2.1-6.15 2.1-.4 0-.8-.02-1.19-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.43-.01-.64.96-.69 1.79-1.56 2.45-2.55z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <div>
                <span className="text-white font-medium block">Get special offers in your inbox</span>
                <span className="text-gray-500 text-xs">Subscribe to our newsletter for exclusive deals</span>
              </div>
            </div>
            <form className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-l-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white w-full md:w-64 placeholder-gray-500"
              />
              <button 
                type="submit"
                className="px-6 py-2.5 bg-amber-500 text-gray-900 font-semibold rounded-r-lg hover:bg-amber-400 transition duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950/50">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <span className="text-white font-bold text-xl tracking-tight">ShopSmart</span>
              <span className="text-gray-500 text-sm">© 2026 All rights reserved</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">We accept:</span>
              <div className="flex gap-2">
                <span className="bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded text-xs font-medium text-gray-300">Visa</span>
                <span className="bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded text-xs font-medium text-gray-300">MasterCard</span>
                <span className="bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded text-xs font-medium text-gray-300">Amex</span>
                <span className="bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded text-xs font-medium text-gray-300">PayPal</span>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-amber-400 transition duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-amber-400 transition duration-200">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-amber-400 transition duration-200">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;