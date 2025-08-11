// src/pages/school/Sidebar.js
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  Bus,
  Map,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Overview", path: "/school/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/school/students", icon: Users },
  { name: "Drivers", path: "/school/drivers", icon: User },
  { name: "Buses", path: "/school/buses", icon: Bus },
  { name: "Trips", path: "/school/trips", icon: Map },
  { name: "Alerts", path: "/school/alerts", icon: AlertTriangle },
  { name: "Settings", path: "/school/settings", icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // For desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile toggle

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      {!mobileOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            className="bg-blue-700 text-white p-2 rounded"
            onClick={toggleMobile}
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-blue-700 text-white p-4 space-y-6 z-40 fixed md:static top-0 left-0 h-screen transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Header: Logo + Mobile Close + Collapse Button */}
        <div className="flex items-center justify-between mb-4 pr-1">
          {/* Logo */}
          <h2
            className={`text-xl md:text-2xl font-bold transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
              collapsed ? "scale-0 opacity-0 w-0" : "scale-100 opacity-100"
            }`}
          >
            KidharHaiBus
          </h2>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={toggleCollapse}
            className="hidden md:block bg-blue-600 p-1 rounded hover:bg-blue-500"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>

          {/* Mobile close toggle (only shown when sidebar is open on mobile) */}
          {mobileOpen && (
            <button
              onClick={toggleMobile}
              className="md:hidden text-white ml-2"
            >
              <X size={24} />
            </button>
          )}
        </div>


        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setMobileOpen(false)} // close drawer on mobile
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-600 transition-all ${
                  isActive ? "bg-white text-blue-700 font-semibold" : ""
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={toggleMobile}
          className="fixed inset-0 bg-black opacity-30 md:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
