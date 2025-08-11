// src/pages/school/Overview.js
import { motion } from "framer-motion";
import {
  Users,
  User,
  Bus,
  Map,
  AlertTriangle,
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
import { useAuth } from "../../context/AuthContext"; // Importing AuthContext

const stats = [
  {
    title: "Total Students",
    value: 128,
    icon: <Users className="w-6 h-6 text-blue-700" />,
    color: "bg-blue-100",
  },
  {
    title: "Total Drivers",
    value: 12,
    icon: <User className="w-6 h-6 text-green-700" />,
    color: "bg-green-100",
  },
  {
    title: "Total Buses",
    value: 15,
    icon: <Bus className="w-6 h-6 text-yellow-700" />,
    color: "bg-yellow-100",
  },
  {
    title: "Trips Today",
    value: 26,
    icon: <Map className="w-6 h-6 text-purple-700" />,
    color: "bg-purple-100",
  },
  {
    title: "Active Alerts",
    value: 3,
    icon: <AlertTriangle className="w-6 h-6 text-red-700" />,
    color: "bg-red-100",
  },
];

const chartData = stats.slice(0, 3).map((stat) => ({
  name: stat.title.replace("Total ", ""),
  count: stat.value,
}));

const Overview = () => {
  const { user } = useAuth(); // Access user info from context
  console.log("User from AuthContext:", user);
  const schoolName = user?.schoolName || "Overview"; // fallback if not loaded

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold mb-6">{schoolName}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-gray-500">{stat.title}</span>
              <span className="text-xl font-bold truncate">{stat.value}</span>
            </div>
            <div
              className={`p-3 rounded-full ${stat.color} flex items-center justify-center ml-4`}
            >
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow w-full mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Key Metrics Overview
        </h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trip History */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow w-full mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Trip History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Bus</th>
                <th className="px-4 py-2">Driver</th>
                <th className="px-4 py-2">Route</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  date: "2025-07-28",
                  bus: "Bus 12",
                  driver: "Ravi Sharma",
                  route: "Sector 5 → DPS",
                  status: "Completed",
                },
                {
                  date: "2025-07-28",
                  bus: "Bus 08",
                  driver: "Neha Das",
                  route: "Ring Road → SJS",
                  status: "Delayed",
                },
                {
                  date: "2025-07-27",
                  bus: "Bus 15",
                  driver: "Arjun Mehta",
                  route: "City Center → St. Mary's",
                  status: "Completed",
                },
                {
                  date: "2025-07-27",
                  bus: "Bus 03",
                  driver: "Kabir Roy",
                  route: "Kabra Lane → DAV",
                  status: "Missed",
                },
              ].map((trip, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{trip.date}</td>
                  <td className="px-4 py-2">{trip.bus}</td>
                  <td className="px-4 py-2">{trip.driver}</td>
                  <td className="px-4 py-2">{trip.route}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        trip.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : trip.status === "Delayed"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4 mt-10">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {[
          {
            label: "Add Student",
            color: "bg-blue-600",
            action: () => alert("Add Student"),
          },
          {
            label: "Assign Driver",
            color: "bg-green-600",
            action: () => alert("Assign Driver"),
          },
          {
            label: "Add New Bus",
            color: "bg-yellow-500",
            action: () => alert("Add Bus"),
          },
        ].map((item, index) => (
          <motion.button
            key={index}
            onClick={item.action}
            whileHover={{ scale: 1.05 }}
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
