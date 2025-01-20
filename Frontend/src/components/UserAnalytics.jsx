import React, { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, Target, TrendingUp, ChevronUp, Calendar, School } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Hero } from "./Hero";

const UserAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchUserList();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/user/analytics');
      const data = await response.json();
      console.log('Analytics data:', data);
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await fetch('/api/users'); // Adjust the endpoint if needed
      const data = await response.json();
      setUserList(data.users); // Assuming the response has a 'users' array
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-6 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="w-full min-h-screen bg-[#A28DED] p-6 space-y-6">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Education Platform Analytics</h1>
        <div className="text-sm text-slate-300">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 shadow-xl">
          <div className="text-sm text-white">Total Users</div>
          <div className="text-2xl font-bold text-white">
            {analytics.currentMetrics.totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center mt-2 text-sm text-white/80">
            <ChevronUp className="h-4 w-4 text-green-400" />
            <span className="text-green-400">
              {analytics.currentMetrics.growthRate}%
            </span>
            <span className="text-white/60 ml-2">vs last month</span>
          </div>
        </div>

        {/* Total Subscriptions */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-sm text-white/80">
            <p>Ebook Subscriptions</p>
            <BookOpen className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-4">
            {analytics.currentMetrics.totalEbookSubscriptions.toLocaleString()}
          </div>
          <div className="text-sm text-white/60 mt-2">
            {analytics.currentMetrics.totalSubscribedUsers} subscribed users
          </div>
        </div>

        {/* New Users This Month */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-sm text-white/80">
            <p>New Users</p>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-4">
            {analytics.currentMetrics.newUsersThisMonth.toLocaleString()}
          </div>
          <div className="text-sm text-white/60 mt-2">This month</div>
        </div>

        {/* Active Target Exams */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-sm text-white/80">
            <p>Target Exams</p>
            <Target className="h-4 w-4 text-yellow-300" />
          </div>
          <div className="text-2xl font-bold text-white mt-4">
            {analytics.distributions.examTargets.length}
          </div>
          <div className="text-sm text-white/60 mt-2">Active exam targets</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* User Growth Chart */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-4">
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
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} labelStyle={{ color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="newUsers" stroke="#3b82f6" fill="url(#userGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Distribution Chart */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-4">
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                  }}
                  labelStyle={{
                    color: '#e2e8f0',
                  }}
                  itemStyle={{
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Exam Distribution */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-4">
          <p className="text-sm text-white/80">Popular Target Exams</p>
          <div className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.distributions.examTargets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} labelStyle={{ color: '#e2e8f0' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* Target Year Distribution (commented) */}
      <div className="bg-slate-800 rounded-2xl shadow-xl p-4">
      <p className="text-sm text-white/80">Target Year Distribution</p>
      <div className="h-[250px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics.distributions.targetYears}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="_id" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} labelStyle={{ color: '#e2e8f0' }} />
            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
        {/* User List Table */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-4 col-span-2 sm:col-span-4">
          <p className="text-sm text-white/80">User List</p>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full table-auto text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Target Exam</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.active ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-2">{user.targetExam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;

