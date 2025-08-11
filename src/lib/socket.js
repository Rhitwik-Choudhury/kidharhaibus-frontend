// src/services/socket.js
import { io } from 'socket.io-client';

/**
 * Determine the Socket.IO server URL.
 * - In production (Netlify build), we rely on REACT_APP_SOCKET_URL
 *   (e.g., https://<your-railway-domain> — no /api here, just the origin).
 * - In development (localhost), default to http://localhost:5000 unless overridden.
 * - Optional: set REACT_APP_BACKEND_URL for LAN testing (e.g., http://192.168.x.x:5000)
 */
const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || // Recommended for Netlify
  process.env.REACT_APP_BACKEND_URL || // Optional: LAN/dev override
  (window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : ''); // Empty string fallback (will error if nothing is set)

/**
 * Create the Socket.IO client.
 * - transports: enforce websocket (avoid polling fallback)
 * - withCredentials: true if you need cookies/session auth
 * - path: only needed if you changed it in server config
 */
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
  // path: '/socket.io' // Uncomment if your server uses a custom path
});

export default socket;
