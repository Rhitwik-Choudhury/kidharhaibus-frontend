import axios from 'axios';

const resolveBackendURL = () => {
  const localIP = '192.168.29.190';
  const port = '5000';

  if (window.location.hostname === 'localhost') {
    return process.env.REACT_APP_BACKEND_URL || `http://localhost:${port}`;
  }

  return process.env.REACT_APP_BACKEND_URL || `http://${localIP}:${port}`;
};

const DIRECT_API_BASE = process.env.REACT_APP_API_URL;
const BACKEND_URL = resolveBackendURL();
const API_BASE = DIRECT_API_BASE || `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

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

export const authAPI = {
  sendOTP: (email) => apiClient.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) => apiClient.post('/auth/verify-otp', { email, otp }),

  signUp: (userData, role) => apiClient.post(`${roleBase(role)}/signup`, userData),
  signIn: (email, password, role) =>
    apiClient.post(`${roleBase(role)}/login`, { email, password }),

  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const studentsAPI = {
  getStudents: (params = {}) => apiClient.get('/school/students', { params }),
  getStudent: (studentId) => apiClient.get(`/school/students/${studentId}`),

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

export const busesAPI = {
  getBuses: (params = {}) => apiClient.get('/buses', { params }),
  getBus: (busId) => apiClient.get(`/buses/${busId}`),

  createBus: (busData) => apiClient.post('/buses', busData),
  updateBus: (busId, updateData) => apiClient.put(`/buses/${busId}`, updateData),
  deleteBus: (busId) => apiClient.delete(`/buses/${busId}`),

  assignDriver: (busId, driverId) =>
    apiClient.put(`/buses/${busId}/assign-driver`, { driverId }),

  removeDriver: (busId) =>
    apiClient.put(`/buses/${busId}/remove-driver`),

  getUnassignedDrivers: (schoolId) =>
    apiClient.get('/buses/unassigned-drivers', { params: { schoolId } }),

  getLiveLocation: (busId) =>
    apiClient.get(`/buses/${busId}/live-location`),
};

export const driversAPI = {
  getDrivers: (schoolId) =>
    apiClient.get("/driver/all", { params: { schoolId } }),
  createDriver: (driverData) =>
    apiClient.post("/driver/signup", driverData),
};

export const parentAPI = {
  getMyProfile: () => apiClient.get('/parent/me'),
  getMyBus: () => apiClient.get('/parent/my-bus'),
  setLocation: (data) => apiClient.post('/parent/set-pickup-location', data),
};

export const routesAPI = {
  getRoutes: (params = {}) => apiClient.get('/routes', { params }),
  getRoute: (routeId) => apiClient.get(`/routes/${routeId}`),
  createRoute: (routeData) => apiClient.post('/routes', routeData),
  updateRoute: (routeId, updateData) => apiClient.put(`/routes/${routeId}`, updateData),
  deleteRoute: (routeId) => apiClient.delete(`/routes/${routeId}`),
  getRouteStudents: (routeId) => apiClient.get(`/routes/${routeId}/students`),
  getRouteBuses: (routeId) => apiClient.get(`/routes/${routeId}/buses`),
};

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

export const handleAPIError = (error) => {
  if (error.response?.data?.detail) return error.response.data.detail;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

export default apiClient;