// src/pages/school/Overview.js

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  User,
  Bus,
  Map,
  Copy,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { schoolDashboardAPI } from "../../services/api";

const Overview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const schoolName = user?.schoolName || "Overview";
  const schoolCode = user?.schoolCode || "Not available";

  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalDrivers: 0,
    totalBuses: 0,
    activeTrips: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  // =========================================================
  // Fetch live dashboard statistics
  // =========================================================
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const response = await schoolDashboardAPI.getStats();

      setDashboardStats({
        totalStudents: response.data?.totalStudents ?? 0,
        totalDrivers: response.data?.totalDrivers ?? 0,
        totalBuses: response.data?.totalBuses ?? 0,
        activeTrips: response.data?.activeTrips ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);

      setStatsError(
        error.response?.data?.message ||
          "Could not load dashboard statistics."
      );
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // =========================================================
  // Dashboard cards
  // =========================================================
  const stats = [
    {
      title: "Total Students",
      value: dashboardStats.totalStudents,
      icon: <Users className="w-6 h-6 text-blue-700" />,
      color: "bg-blue-100",
    },
    {
      title: "Total Drivers",
      value: dashboardStats.totalDrivers,
      icon: <User className="w-6 h-6 text-green-700" />,
      color: "bg-green-100",
    },
    {
      title: "Total Buses",
      value: dashboardStats.totalBuses,
      icon: <Bus className="w-6 h-6 text-yellow-700" />,
      color: "bg-yellow-100",
    },
    {
      title: "Active Trips",
      value: dashboardStats.activeTrips,
      icon: <Map className="w-6 h-6 text-purple-700" />,
      color: "bg-purple-100",
    },
  ];

  const chartData = stats.slice(0, 3).map((stat) => ({
    name: stat.title.replace("Total ", ""),
    count: stat.value,
  }));

  // =========================================================
  // Copy school code
  // =========================================================
  const handleCopySchoolCode = async () => {
    if (!user?.schoolCode) {
      alert(
        "School code is not available. Please log out and log in again."
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(user.schoolCode);
      alert("School code copied!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Could not copy school code. Please copy it manually.");
    }
  };

  // =========================================================
  // Quick actions
  // =========================================================
  const quickActions = [
    {
      label: "Add Student",
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => navigate("/school/students"),
    },
    {
      label: "Assign Driver",
      color: "bg-green-600 hover:bg-green-700",
      action: () => navigate("/school/buses"),
    },
    {
      label: "Add New Bus",
      color: "bg-yellow-500 hover:bg-yellow-600",
      action: () => navigate("/school/buses"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* =====================================================
          Header
      ====================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {schoolName}
        </h1>

        <button
          type="button"
          onClick={fetchDashboardStats}
          disabled={statsLoading}
          className="inline-flex items-center justify-center gap-2 self-start sm:self-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              statsLoading ? "animate-spin" : ""
            }`}
          />

          {statsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          School Code Card
      ====================================================== */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700">
            School Code
          </p>

          <p className="text-2xl font-bold text-blue-900 tracking-wider">
            {schoolCode}
          </p>

          <p className="text-xs text-blue-600 mt-1">
            Share this code with drivers during signup so they can join
            your school.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopySchoolCode}
          disabled={!user?.schoolCode}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy className="w-4 h-4" />
          Copy Code
        </button>
      </div>

      {/* =====================================================
          Stats Error
      ====================================================== */}
      {statsError && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {statsError}
          </p>

          <button
            type="button"
            onClick={fetchDashboardStats}
            className="text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      )}

      {/* =====================================================
          Stats Cards
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-2 hover:ring-blue-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.08,
            }}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-gray-500">
                {stat.title}
              </span>

              <span className="text-2xl font-bold text-gray-900 truncate mt-1">
                {statsLoading ? "—" : stat.value}
              </span>
            </div>

            <div
              className={`p-3 rounded-full ${stat.color} flex items-center justify-center ml-4 flex-shrink-0`}
            >
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* =====================================================
          Bar Chart
      ====================================================== */}
      <div className="bg-white p-6 rounded-lg shadow w-full mb-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Key Metrics Overview
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Current students, drivers and buses registered with your
              school.
            </p>
          </div>
        </div>

        <div className="w-full h-[300px]">
          {statsLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400">
                Loading metrics...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis
                  allowDecimals={false}
                  domain={[0, "auto"]}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* =====================================================
          Trip History Placeholder
      ====================================================== */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow w-full mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Trip History
        </h2>

        <div className="flex min-h-[150px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="text-center px-4 py-6">
            <Map className="w-8 h-8 text-gray-400 mx-auto mb-3" />

            <p className="font-medium text-gray-600">
              Trip history will appear here
            </p>

            <p className="mt-1 text-sm text-gray-400 max-w-md">
              Completed school bus trips will be displayed once trip
              history tracking is available.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          Quick Actions
      ====================================================== */}
      <h2 className="text-lg font-semibold mb-4 mt-10 text-gray-800">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {quickActions.map((item) => (
          <motion.button
            key={item.label}
            type="button"
            onClick={item.action}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`text-white font-medium py-4 rounded-lg transition-all ${item.color} hover:shadow-xl`}
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Overview;