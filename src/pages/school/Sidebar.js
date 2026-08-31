// src/pages/school/Sidebar.js
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  User,
  Bus,
  Map,
  AlertTriangle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Overview", path: "/school/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/school/students", icon: Users },
  { name: "Drivers", path: "/school/drivers", icon: User },
  { name: "Buses", path: "/school/buses", icon: Bus },
  { name: "Trips", path: "/school/trips", icon: Map },
  { name: "Alerts", path: "/school/alerts", icon: AlertTriangle },
  { name: "Delete Account", path: "/delete-account", icon: Trash2, external: true },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // For desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile toggle
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    await logout();
    navigate("/auth/school/signin", { replace: true });
  };

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
        className={`bg-blue-700 text-white p-4 z-40 fixed md:static top-0 left-0 h-screen transform transition-transform duration-300 ease-in-out flex flex-col
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
            Trackefy
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
        <nav className="flex flex-1 flex-col space-y-2">
          {navItems.map(({ name, path, icon: Icon, external }) => {
            if (external) {
              return (
                <a
                  key={name}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-600 transition-all text-red-200"
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span>{name}</span>}
                </a>
              );
            }

            return (
              <NavLink
                key={name}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-600 transition-all ${
                    isActive ? "bg-white text-blue-700 font-semibold" : ""
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{name}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-blue-500/70 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span>{isLoggingOut ? "Logging out…" : "Logout"}</span>
            )}
          </button>
        </div>
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
