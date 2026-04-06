import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { orderAPI } from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll({ limit: 10 });
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiClock className="text-yellow-500" />;
      case 'shipped':
        return <FiPackage className="text-blue-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
            <Link to="/products" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-gray-800">₹{order.totalAmount}</p>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="text-sm font-medium capitalize">{order.orderStatus}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Items ({order.items.length})</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Subtotal: ₹{order.subtotal}</p>
                      <p className="text-gray-500">Shipping: ₹{order.shippingCost}</p>
                      <p className="text-gray-500">Tax: ₹{order.tax}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">Total: ₹{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address:</p>
                      <p className="text-gray-800">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;