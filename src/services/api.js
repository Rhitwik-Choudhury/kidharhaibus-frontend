// src/services/api.js
import axios from 'axios';

/**
 * Resolve the backend *origin* for cases where REACT_APP_API_URL is not provided.
 * This is mainly useful for local/LAN testing on phones in the same Wi-Fi.
 *
 * Behavior:
 * - On localhost: prefer REACT_APP_BACKEND_URL (if you set it), else http://localhost:<port>
 * - On non-localhost (e.g., your phone hitting the dev machine): prefer REACT_APP_BACKEND_URL,
 *   else fall back to your machine's LAN IP (so the phone can reach it)
 */
const resolveBackendURL = () => {
  const localIP = '192.168.29.190'; // your laptop's LAN IP for phone testing
  const port = '5000';

  // If running in a localhost tab (CRA dev server)
  if (window.location.hostname === 'localhost') {
    return process.env.REACT_APP_BACKEND_URL || `http://localhost:${port}`;
  }

  // Otherwise (e.g., device on LAN hitting your machine)
  return process.env.REACT_APP_BACKEND_URL || `http://${localIP}:${port}`;
};

/**
 * Preferred way for CRA + Netlify:
 *   REACT_APP_API_URL = https://<railway-domain>/api
 * If that is set, we use it directly.
 * If not set (e.g., local/LAN testing), we compute BACKEND_URL and append "/api".
 */
const DIRECT_API_BASE = process.env.REACT_APP_API_URL; // e.g., https://kidharhaibus-backend-production.up.railway.app/api
const BACKEND_URL = resolveBackendURL();                // e.g., http://localhost:5000  OR  http://192.168.x.x:5000
const API_BASE = DIRECT_API_BASE || `${BACKEND_URL}/api`;

/**
 * Shared Axios instance for all REST calls.
 * - baseURL: points at "/api"
 * - timeout: raised to 30s because email OTP can take >10s sometimes
 * - headers: JSON by default
 * - request interceptor: injects Bearer token when present
 * - response interceptor: central 401 handling → clears session and redirects to home
 */
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // was 10000 — bumped to avoid OTP timeouts
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: false, // default; set true only if you use cookies
});

// Inject JWT from localStorage if present (Authorization: Bearer <token>)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kidharhaibus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler: clear session and bounce to "/"
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kidharhaibus_token');
      localStorage.removeItem('kidharhaibus_user');
      localStorage.removeItem('kidharhaibus_role');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/**
 * Helper: map UI role → router base used by your backend.
 * Matches your Express mounts:
 *   app.use('/api/parent', parentRoutes)
 *   app.use('/api/school', schoolRoutes)
 *   app.use('/api/driver', driverRoutes)
 */
const roleBase = (role) => {
  switch ((role || '').toLowerCase()) {
    case 'parent':
      return '/parent';
    case 'school':
      return '/school';
    case 'driver':
      return '/driver';
    default:
      throw new Error(`Unknown role "${role}"`);
  }
};

/* =========================
 *           AUTH API
 * =========================
 * OTP endpoints live under /api/auth/*
 * Sign up / Sign in are role-scoped:
 *   POST /api/parent/signup, /api/parent/login
 *   POST /api/school/signup
 *   POST /api/driver/signup
 */
export const authAPI = {
  // OTP
  sendOTP: (email) => apiClient.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) => apiClient.post('/auth/verify-otp', { email, otp }),

  // Role-scoped signup/login
  signUp: (userData, role) => apiClient.post(`${roleBase(role)}/signup`, userData),
  signIn: (email, password, role) =>
    apiClient.post(`${roleBase(role)}/login`, { email, password }),

  // Optional helpers (implement on backend if/when needed)
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

/* =========================
 *         STUDENTS API
 * ========================= */
export const studentsAPI = {
  getStudents: (params = {}) => apiClient.get('/school/students', { params }),
  getStudent: (studentId) => apiClient.get(`/school/students/${studentId}`),

  // Include the schoolId from the logged-in school user
  createStudent: (studentData) => {
    const user = JSON.parse(localStorage.getItem('kidharhaibus_user'));
    const schoolId = user?._id || user?.id;
    return apiClient.post('/school/students', { ...studentData, schoolId });
  },

  updateStudent: (studentId, updateData) =>
    apiClient.put(`/school/students/${studentId}`, updateData),

  deleteStudent: (studentId) => apiClient.delete(`/school/students/${studentId}`),

  getStudentByCode: (studentCode) =>
    apiClient.get(`/school/students/by-code/${studentCode}`),
};

/* =========================
 *           BUSES API
 * ========================= */
export const busesAPI = {
  getBuses: (params = {}) => apiClient.get('/buses', { params }),
  getBus: (busId) => apiClient.get(`/buses/${busId}`),
  createBus: (busData) => apiClient.post('/buses', busData),
  updateBus: (busId, updateData) => apiClient.put(`/buses/${busId}`, updateData),
  deleteBus: (busId) => apiClient.delete(`/buses/${busId}`),
  updateBusLocation: (busId, locationData) =>
    apiClient.post(`/buses/${busId}/location`, locationData),
};

/* =========================
 *           ROUTES API
 * ========================= */
export const routesAPI = {
  getRoutes: (params = {}) => apiClient.get('/routes', { params }),
  getRoute: (routeId) => apiClient.get(`/routes/${routeId}`),
  createRoute: (routeData) => apiClient.post('/routes', routeData),
  updateRoute: (routeId, updateData) => apiClient.put(`/routes/${routeId}`, updateData),
  deleteRoute: (routeId) => apiClient.delete(`/routes/${routeId}`),
  getRouteStudents: (routeId) => apiClient.get(`/routes/${routeId}/students`),
  getRouteBuses: (routeId) => apiClient.get(`/routes/${routeId}/buses`),
};

/* =========================
 *            TRIPS API
 * ========================= */
export const tripsAPI = {
  getTrips: (params = {}) => apiClient.get('/trips', { params }),
  getTrip: (tripId) => apiClient.get(`/trips/${tripId}`),
  createTrip: (tripData) => apiClient.post('/trips', tripData),
  updateTrip: (tripId, updateData) => apiClient.put(`/trips/${tripId}`, updateData),
  startTrip: (tripId, startData) => apiClient.post(`/trips/${tripId}/start`, startData),
  endTrip: (tripId, endData) => apiClient.post(`/trips/${tripId}/end`, endData),
  updateAttendance: (tripId, attendanceData) =>
    apiClient.post(`/trips/${tripId}/attendance`, attendanceData),
};

/* =========================
 *            ALERTS API
 * ========================= */
export const alertsAPI = {
  getAlerts: (params = {}) => apiClient.get('/alerts', { params }),
  getAlert: (alertId) => apiClient.get(`/alerts/${alertId}`),
  createAlert: (alertData) => apiClient.post('/alerts', alertData),
  createEmergencyAlert: (emergencyData) =>
    apiClient.post('/alerts/emergency', emergencyData),
  createBroadcastAlert: (broadcastData) =>
    apiClient.post('/alerts/broadcast', broadcastData),
  updateAlert: (alertId, updateData) => apiClient.put(`/alerts/${alertId}`, updateData),
  markAllRead: () => apiClient.post('/alerts/mark-all-read'),
  getAlertStats: () => apiClient.get('/alerts/stats'),
};

/**
 * Normalize any Axios error to a human-readable string.
 * - prefer backend-provided { detail } or { message }
 * - fall back to generic error.message
 */
export const handleAPIError = (error) => {
  if (error.response?.data?.detail) return error.response.data.detail;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

export default apiClient;
