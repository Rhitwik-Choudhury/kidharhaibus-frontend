// src/services/socket.js
import { io } from 'socket.io-client';

/**
 * Decide which Socket.IO server URL to use.
 * Priority:
 * 1) REACT_APP_SOCKET_URL  → production on Netlify (e.g., https://kidharhaibus-backend-production.up.railway.app)
 * 2) REACT_APP_BACKEND_URL → optional LAN/dev override (e.g., http://192.168.x.x:5000)
 * 3) localhost fallback     → when running CRA locally
 *
 * NOTE: In production, #1 MUST be set. Do NOT append `/api` here — sockets use the origin only.
 */
const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : ''); // empty in prod if misconfigured

/**
 * Create the Socket.IO client.
 * - We DO NOT force "websocket" transport. Allow polling first → then upgrade to websocket.
 *   (Some hosts/proxies reject a direct websocket-only handshake.)
 * - withCredentials: keep true if you plan to use cookies/session; harmless otherwise.
 * - reconnection: graceful retries if the connection drops or the server is redeploying.
 * - path: only set if you changed it on the server (default is "/socket.io").
 */
const socket = io(SOCKET_URL, {
  // transports: ['websocket'], // ← removed on purpose to allow polling → websocket upgrade
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  // path: '/socket.io', // uncomment only if you customized it server-side
});

export default socket;
