import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  Target,
  TrendingUp,
  ChevronUp,
  Calendar,
  School,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Reviews from "./Reviews"
import { HiShoppingBag } from "react-icons/hi";
import { Spinner } from "../../../utils/Loader/Spinner"

const UserAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        // If already selected, remove from array
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        // If not selected, add to array
        return [...prevSelectedUsers, userId];
      }
    });
  };
  
  useEffect(() => {
    fetchAnalytics();
    fetchUserList();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/user/analytics");
      const data = await response.json();
      console.log("Analytics data:", data);
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      // selectedUsers.forEach(async (userId) => {
      const response = await fetch(
        `/api/user/delete/678c9d9164ef845e64345e60`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!data.success) {
        alert("Unable to delete 'User'");
      }
      // })
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await fetch("/api/user/userlist"); // Adjust the endpoint if needed
      const data = await response.json();
      console.log("User list:", data.users);
      setUserList(data.users); // Assuming the response has a 'users' array
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  // Colors for charts
  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full min-h-screen bg-blue-950 p-6 space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white p-6 rounded-2xl shadow-xl mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-white/70 mt-1">
                Monitor platform performance and user engagement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAnalytics}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl 
              flex items-center gap-2 font-medium transition-all duration-200 shadow"
              disabled={loading}
            >
              <TrendingUp className="w-5 h-5" />
              Refresh Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl
              flex items-center gap-2 font-medium transition-all duration-200 shadow"
            >
              <Calendar className="w-5 h-5" />
              Last updated: {new Date().toLocaleString()}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Users */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 shadow-xl"
        >
          <div className="text-sm text-white">Total Users</div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            {analytics.currentMetrics.totalUsers.toLocaleString()}
          </motion.div>
          <div className="flex items-center mt-2 text-sm text-white/80">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 30, 0] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <ChevronUp className="h-4 w-4 text-green-400" />
            </motion.div>
            <span className="text-green-400">
              {analytics.currentMetrics.growthRate}%
            </span>
            <span className="text-white/60 ml-2">vs last month</span>
          </div>
        </motion.div>

        {/* Total Subscriptions */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between text-sm text-white/80">
            <p>Ebook Subscriptions</p>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -15, 0, 15, 0] }}
              transition={{ delay: 0.7, duration: 1, repeat: 0 }}
            >
              <BookOpen className="h-4 w-4 text-yellow-400" />
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold text-white mt-4"
          >
            {analytics.currentMetrics.totalEbookSubscriptions.toLocaleString()}
          </motion.div>
          <div className="text-sm text-white/60 mt-2">
            {analytics.currentMetrics.totalSubscribedUsers} subscribed users
          </div>
        </motion.div>

        {/* New Users This Month */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between text-sm text-white/80">
            <p>New Users</p>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <TrendingUp className="h-4 w-4 text-green-400" />
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold text-white mt-4"
          >
            {analytics.currentMetrics.newUsersThisMonth.toLocaleString()}
          </motion.div>
          <div className="text-sm text-white/60 mt-2">This month</div>
        </motion.div>

        {/* Active Target Exams */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between text-sm text-white/80">
            <p>Target Exams</p>
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }}
              transition={{ delay: 1.1, duration: 1 }}
            >
              <Target className="h-4 w-4 text-yellow-300" />
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold text-white mt-4"
          >
            {analytics.distributions.examTargets.length}
          </motion.div>
          <div className="text-sm text-white/60 mt-2">Active exam targets</div>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
      >
        {/* User Growth Chart */}
        <motion.div 
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-slate-800 rounded-2xl shadow-xl p-4"
        >
          <p className="text-sm text-white/80">User Growth Trend</p>
          <div className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyGrowth}>
                <defs>
                  <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#3b82f6"
                  fill="url(#userGrowth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Class Distribution Chart */}
        <motion.div 
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-slate-800 rounded-2xl shadow-xl p-4"
        >
          <p className="text-sm text-white/80">Class Distribution</p>
          <div className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.distributions.classes}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry._id}
                >
                  {analytics.distributions.classes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                  }}
                  labelStyle={{
                    color: "#e2e8f0",
                  }}
                  itemStyle={{
                    color: "#ffffff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Target Exam Distribution */}
        <motion.div 
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-slate-800 rounded-2xl shadow-xl p-4"
        >
          <p className="text-sm text-white/80">Popular Target Exams</p>
          <div className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.distributions.examTargets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Target Year Distribution */}
        <motion.div 
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-slate-800 rounded-2xl shadow-xl p-4"
        >
          <p className="text-sm text-white/80">Target Year Distribution</p>
          <div className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.distributions.targetYears}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* User List */}
        <motion.div 
          variants={chartVariants}
          className="bg-slate-800 rounded-2xl shadow-xl p-4 col-span-2 sm:col-span-4"
        >
          <p className="text-sm text-white/80">User List</p>
          
          {/* Show delete button if any user is selected */}
          <AnimatePresence>
            {selectedUsers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 ml-[80%]"
              >
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteUsers}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete Selected Users
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full table-auto text-white">
              <thead>
                <tr className="pl-1 ml-1">
                  <th className="px-4 py-2 text-left">Select</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Target Exam</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => (
                  <motion.tr 
                    key={user._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    className="hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleCheckboxChange(user._id)}
                        className="pl-1 ml-1"
                      />
                    </td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">
                      <motion.span
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.active 
                            ? "bg-green-500/20 text-green-300" 
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </motion.span>
                    </td>
                    <td className="px-4 py-2">{user.targetExam}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Reviews />
      </motion.div>
    </motion.div>
  );
};

export default UserAnalytics;