import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/order/orderSlice";
import { FaBox, FaTruck, FaCheck, FaClock } from "react-icons/fa";
import { ArrowDownAZ } from "lucide-react";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const orderState = useSelector((state) => state.orders);
  const { orders, loading } = orderState || { orders: [], loading: false };
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    getAllOrdersByUser();
    dispatch(fetchUserOrders());
  }, [currentUser, dispatch, navigate]);

  const getAllOrdersByUser = async () => {
    try {
      const response = await fetch("/api/order/getordersbyuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error getting your orders");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
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
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {/* Order Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              className={`pb-2 px-4 ${
                activeTab === "all"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Orders
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === "processing"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("processing")}
            >
              Processing
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === "delivered"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("delivered")}
            >
              Delivered
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ₹{item.product.price}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total Items:</span>
                    <span>
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="font-medium">Order Total:</span>
                    <span className="font-bold text-lg">₹{order.total}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-500">
                    Track Order
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-500">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
