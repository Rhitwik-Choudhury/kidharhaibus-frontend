// src/App.js
/**
 * App router
 * ----------
 * - Wires public auth pages
 * - Wires School routes bundle
 * - Replaces the Parent dashboard placeholder with the live map dashboard
 * - Keeps Driver dashboard route
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';

import 'leaflet/dist/leaflet.css'; // Leaflet styles (required for map UI)

// Pages
import LandingPage from './pages/LandingPage';
import ParentSignIn from './pages/auth/ParentSignIn';
import ParentSignUp from './pages/auth/ParentSignUp';
import SchoolSignIn from './pages/auth/SchoolSignIn';
import SchoolSignUp from './pages/auth/SchoolSignUp';
import DriverSignIn from './pages/auth/DriverSignIn';
import DriverSignUp from './pages/auth/DriverSignUp';

// Dashboards
import DriverDashboard from './pages/drivers/DriverDashboard';
import ParentDashboard from './pages/Parents/ParentDashboard';

// School sub-routes
import schoolRoutes from './pages/school/schoolRoutes';

import './App.css';

function App() {
  const { darkMode } = useTheme();

  // just to verify the theme is wiring correctly
  useEffect(() => {
    console.log('darkMode state:', darkMode);
    console.log('html class:', document.documentElement.className);
  }, [darkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/auth/parent/signin" element={<ParentSignIn />} />
            <Route path="/auth/parent/signup" element={<ParentSignUp />} />
            <Route path="/auth/school/signin" element={<SchoolSignIn />} />
            <Route path="/auth/school/signup" element={<SchoolSignUp />} />
            <Route path="/auth/driver/signin" element={<DriverSignIn />} />
            <Route path="/auth/driver/signup" element={<DriverSignUp />} />

            {/* School dashboard routes bundle */}
            {schoolRoutes}

            {/* Live dashboards */}
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast system (global) */}
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
