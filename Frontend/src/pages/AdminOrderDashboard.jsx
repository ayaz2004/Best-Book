import { useState, useEffect } from "react";
import { Card, Table, Badge, Button, TextInput, Select } from "flowbite-react";
import { motion } from "framer-motion";
import {
  HiShoppingBag,
  HiCurrencyRupee,
  HiUserGroup,
  HiRefresh,
  HiSearch,
  HiFilter,
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
        // headers: {
        //   Authorization: `Bearer ${currentUser.accessToken}`,
        // },
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
      const res = await fetch(`/api/order/update-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
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

  const statusColors = {
    PENDING: "warning",
    PROCESSING: "info",
    SHIPPED: "purple",
    DELIVERED: "success",
    CANCELLED: "failure",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-purple-200 to-purple-200 py-10 px-4 sm:px-6 lg:px-8">
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-white/10 backdrop-blur-lg"
      /> */}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 space-y-6"
      >
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center">
              <HiShoppingBag className="w-10 h-10 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-xl font-bold">{statistics.total}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <HiCurrencyRupee className="w-10 h-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-xl font-bold">₹{statistics.revenue}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <HiRefresh className="w-10 h-10 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Orders</p>
                <h3 className="text-xl font-bold">{statistics.pending}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <HiUserGroup className="w-10 h-10 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Customers</p>
                <h3 className="text-xl font-bold">{statistics.customers}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            icon={HiSearch}
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            icon={HiFilter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
          <Button gradientDuoTone="purpleToBlue">
            <HiDownload className="mr-2" /> Export
          </Button>
        </div>

        {/* Orders Table */}
        <Card>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Order ID</Table.HeadCell>
              <Table.HeadCell>Customer</Table.HeadCell>
              <Table.HeadCell>Items</Table.HeadCell>
              <Table.HeadCell>Total Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredOrders.map((order) => (
                <Table.Row key={order._id} className="bg-white">
                  <Table.Cell className="font-medium">
                    {order._id.slice(-6)}
                  </Table.Cell>
                  <Table.Cell>{order.userId}</Table.Cell>
                  <Table.Cell>{order.items.length} items</Table.Cell>
                  <Table.Cell>₹{order.totalAmount}</Table.Cell>
                  <Table.Cell>
                    <Badge color={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Select
                      size="sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Select>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </motion.div>
    </div>
  );
}
