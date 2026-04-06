import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Please login to view your cart</p>
          <Link to="/login" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
          <Link to="/products" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = totalAmount > 500 ? 0 : 50;
  const tax = Math.round(totalAmount * 0.1);
  const finalTotal = totalAmount + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart ({cart.items.length} items)</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.images?.[0] ? (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <Link to={`/products/${item.product?._id}`} className="font-semibold text-gray-800 hover:text-orange-500">
                    {item.product?.name || 'Product'}
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">₹{item.price} each</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item._id || item.product?._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">₹{tax}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>

            {totalAmount < 500 && (
              <p className="text-sm text-green-600 mt-3">
                Add ₹{500 - totalAmount} more for free shipping!
              </p>
            )}

            <Link 
              to="/checkout"
              className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition mt-6"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              to="/products"
              className="block text-center text-orange-500 hover:underline mt-4 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
