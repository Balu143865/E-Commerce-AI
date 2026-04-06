import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await orderAPI.create({
        shippingAddress,
        paymentMethod
      });

      if (res.data.order) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500">Redirecting to orders...</p>
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
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMapPin className="mr-2" /> Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCreditCard className="mr-2" /> Payment Method
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive the order</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">Card Payment</p>
                      <p className="text-sm text-gray-500">Pay with debit/credit card</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">Online Banking</p>
                      <p className="text-sm text-gray-500">Pay using UPI or net banking</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.items.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 mt-6"
              >
                {loading ? 'Processing...' : `Place Order - ₹${finalTotal}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;