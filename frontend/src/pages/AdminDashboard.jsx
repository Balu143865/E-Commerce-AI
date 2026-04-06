import React, { useState, useEffect } from 'react';
import { FiPackage, FiShoppingCart, FiUsers, FiPlus, FiEdit2, FiTrash2, FiGrid } from 'react-icons/fi';
import { productAPI, orderAPI } from '../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Men',
    brand: '',
    stock: '',
    images: [''],
    isFeatured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productAPI.getAll({ limit: 100 }),
        orderAPI.getAllAdmin({ limit: 50 })
      ]);

      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
      
      const totalRevenue = ordersRes.data.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      setStats({
        totalProducts: productsRes.data.pagination.total,
        totalOrders: ordersRes.data.pagination.total,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stock: Number(productForm.stock),
        images: productForm.images.filter(img => img)
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, data);
      } else {
        await productAPI.create(data);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Men',
        brand: '',
        stock: '',
        images: [''],
        isFeatured: false
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      brand: product.brand || '',
      stock: product.stock,
      images: product.images || [''],
      isFeatured: product.isFeatured
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { orderStatus: status });
      fetchData();
    } catch (error) {
      alert('Failed to update order status');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-orange-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <FiShoppingCart className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <FiUsers className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'products' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <FiPackage className="inline mr-2" /> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <FiShoppingCart className="inline mr-2" /> Orders
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Products</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    originalPrice: '',
                    category: 'Men',
                    brand: '',
                    stock: '',
                    images: [''],
                    isFeatured: false
                  });
                  setShowProductForm(true);
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
              >
                <FiPlus className="mr-2" /> Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={() => setShowProductForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows="3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Original Price</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          {['Men', 'Women', 'Electronics', 'Accessories', 'Footwear', 'Home', 'Sports'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input
                        type="url"
                        value={productForm.images[0]}
                        onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        className="mr-2"
                      />
                      <label htmlFor="featured">Mark as Featured</label>
                    </div>
                    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3">
                            {product.images?.[0] && (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-gray-800">₹{product.price}</td>
                      <td className="px-6 py-4">
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditProduct(product)} className="text-blue-500 hover:text-blue-700">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-800">{order.user?.name}</p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;