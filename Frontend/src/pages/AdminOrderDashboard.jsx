import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiShoppingBag,
  HiCurrencyRupee,
  HiUserGroup,
  HiRefresh,
  HiSearch,
  HiDownload,
} from "react-icons/hi";
import { useSelector } from "react-redux";

export default function AdminOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    revenue: 0,
    customers: 0,
  });
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.accessToken) fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await fetch("/api/order/getallorders", {
        method: "GET",
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Failed to fetch orders");
      }

      setOrders(responseData.data);
      calculateStatistics(responseData.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (orderData) => {
    const stats = orderData.reduce(
      (acc, order) => ({
        total: acc.total + 1,
        pending: acc.pending + (order.status === "PENDING" ? 1 : 0),
        revenue: acc.revenue + order.totalAmount,
        customers: acc.customers + 1,
      }),
      { total: 0, pending: 0, revenue: 0, customers: 0 }
    );
    setStatistics(stats);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/order/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const errorData = await res.json();
        console.error("Error updating order status:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error.message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order._id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // const statusColors = {
  //   PENDING: "warning",
  //   PROCESSING: "info",
  //   SHIPPED: "purple",
  //   DELIVERED: "success",
  //   CANCELLED: "failure",
  // };

  const statusClasses = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-purple-50 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white p-6 rounded-2xl shadow-xl mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <HiShoppingBag className="text-3xl" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Admin Dashboard - Manage Orders
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchOrders}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow"
            disabled={loading}
          >
            <HiRefresh className="text-xl" />
            Refresh Data
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      >
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <HiShoppingBag className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.total}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white">
              <HiCurrencyRupee className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-blue-900">
                ₹{statistics.revenue.toFixed(2)}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
              <HiRefresh className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">
                Pending Orders
              </p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.pending}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <HiUserGroup className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">
                Total Customers
              </p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.customers}
              </h3>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>

          <div className="w-full sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-4 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <HiDownload className="mr-2" /> Export
          </motion.button>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 overflow-hidden mb-6 flex-1"
      >
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-800 to-purple-800 text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Total Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-blue-900">
                        #{order._id.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {order.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {order.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-900">
                        ₹{order.totalAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          statusClasses[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className="py-2 px-3 border border-purple-200 rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
