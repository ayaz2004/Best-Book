import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/order/orderSlice";
import {
  FaBox,
  FaTruck,
  FaCheck,
  FaClock,
  FaSearch,
  FaMapMarkerAlt,
  FaWallet,
} from "react-icons/fa";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const {
    orders = [],
    loading = false,
    error = null,
  } = useSelector(
    (state) => state.order || { orders: [], loading: false, error: null }
  );
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    dispatch(fetchUserOrders());
  }, [currentUser, dispatch, navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "processing":
        return <FaBox className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "delivered":
        return <FaCheck className="text-green-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      activeTab === "all" || order.status?.toLowerCase() === activeTab;
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      order._id?.toLowerCase().includes(search) ||
      order.items?.some((item) =>
        item.product?.title?.toLowerCase().includes(search)
      );
    return matchesStatus && matchesSearch;
  });

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order._id?.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-medium capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <div className="flex items-center gap-2">
                      <FaWallet
                        className={
                          order.isPaymentDone
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      />
                      <span className="font-medium">
                        {order.isPaymentDone ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <h3 className="font-medium text-gray-900">
                    Shipping Address
                  </h3>
                </div>
                <address className="text-sm text-gray-600 not-italic">
                  {order.shippingAddress?.address1}
                  <br />
                  {order.shippingAddress?.address2 && (
                    <>
                      {order.shippingAddress.address2}
                      <br />
                    </>
                  )}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.pinCode}
                </address>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Order Items</h3>
                <div className="divide-y divide-gray-200">
                  {order.items?.map((item, index) => (
                    <div key={index} className="py-4 flex items-center gap-4">
                      <img
                        src={item.product?.coverImage || "/placeholder.png"}
                        alt={item.product?.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product?.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ₹{item.product?.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.quantity * item.product?.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Items Total</span>
                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>
                    <span>
                      -₹
                      {(
                        (order.totalAmount * order.coupon.discountPercentage) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with Search */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 border-b-2 px-6 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg">{error}</div>
                <button
                  onClick={() => dispatch(fetchUserOrders())}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Try Again
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500">
                            Order #{order._id?.slice(-8)}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                          {getStatusIcon(order.status)}
                          <span className="text-sm font-medium capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4 justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
