import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/order/orderSlice";
import { motion } from "framer-motion";
import {
  FaBox,
  FaTruck,
  FaCheck,
  FaClock,
  FaSearch,
  FaMapMarkerAlt,
  FaWallet,
  FaAngleRight,
  FaTimes,
  FaRegListAlt,
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    { id: "all", label: "All Orders", icon: FaRegListAlt },
    { id: "pending", label: "Pending", icon: FaClock },
    { id: "shipped", label: "Shipped", icon: FaTruck },
    { id: "delivered", label: "Delivered", icon: FaCheck },
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-800 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-xl font-bold text-white">Order Details</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <FaTimes />
            </motion.button>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Order ID</p>
                    <p className="font-medium text-blue-900">
                      #{order._id?.slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Order Date</p>
                    <p className="font-medium text-blue-900">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-medium capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Payment</p>
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
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-purple-600" />
                  <h3 className="font-medium text-purple-900">
                    Shipping Address
                  </h3>
                </div>
                <address className="text-sm text-purple-800 not-italic">
                  {order.shippingAddress?.firstName}{" "}
                  {order.shippingAddress?.lastName}
                  <br />
                  {order.shippingAddress?.address1}
                  <br />
                  {order.shippingAddress?.address2 && (
                    <>
                      {order.shippingAddress.address2}
                      <br />
                    </>
                  )}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.pinCode ||
                    order.shippingAddress?.pincode}
                  <br />
                  Phone: {order.shippingAddress?.phone}
                </address>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium text-blue-900 mb-3">Order Items</h3>
                <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {order.items?.map((item, index) => (
                    <div key={index} className="p-4 flex items-center gap-4">
                      <img
                        src={item.product?.coverImage || "/placeholder.png"}
                        alt={item.product?.title}
                        className="w-16 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">
                          {item.product?.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Type:{" "}
                          {item.productType === "ebook" ? "eBook" : "Hardcopy"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.product?.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-700">
                          ₹{(item.quantity * item.product?.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-medium text-blue-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-blue-700">
                    <span>Items Total</span>
                    <span>₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                  {order.coupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>
                        -₹
                        {(
                          (order.totalAmount *
                            order.coupon.discountPercentage) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-blue-900 pt-2 border-t border-blue-200">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-center mt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-2 px-8 rounded-xl hover:shadow-lg transition-all"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-800 px-6 py-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-white">My Orders</h1>
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/75 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/75" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white">
            <div className="overflow-x-auto flex">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 flex items-center gap-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "text-purple-700 border-b-2 border-purple-700"
                      : "text-gray-600 hover:text-blue-800 hover:bg-blue-50/50"
                  }`}
                >
                  <tab.icon
                    className={
                      activeTab === tab.id ? "text-purple-700" : "text-gray-500"
                    }
                  />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(fetchUserOrders())}
                  className="px-6 py-2 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Try Again
                </motion.button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No orders found</p>
                <p className="text-gray-500 text-sm mb-6">
                  {activeTab !== "all"
                    ? `You don't have any ${activeTab} orders yet.`
                    : searchTerm
                    ? "No orders match your search."
                    : "Start shopping to place your first order!"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/all-books")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Browse Books
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">
                            Order #{order._id?.slice(-8)}
                          </p>
                          <p className="text-base font-semibold text-blue-900 mt-1">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>

                      {/* Order Preview */}
                      <div className="mt-3 mb-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={
                                item.product?.coverImage || "/placeholder.png"
                              }
                              alt=""
                              className="w-10 h-14 object-cover rounded-md shadow-sm"
                            />
                          ))}
                          {order.items?.length > 3 && (
                            <div className="w-10 h-14 bg-gray-100 rounded-md flex items-center justify-center text-xs font-medium text-gray-600">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            {order.items?.length}{" "}
                            {order.items?.length === 1 ? "item" : "items"} •
                            <span className="font-medium text-blue-900 ml-1">
                              ₹{order.totalAmount?.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedOrder(order)}
                          className="w-full py-2.5 px-6 text-sm font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-lg hover:shadow transition-all"
                        >
                          View Details
                          <FaAngleRight size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
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
