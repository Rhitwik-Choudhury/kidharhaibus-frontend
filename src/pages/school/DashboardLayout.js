import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative">

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform bg-white shadow-md transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto z-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
