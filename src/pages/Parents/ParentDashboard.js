// src/pages/Parents/ParentDashboard.js
/**
 * ParentDashboard
 * ----------------
 * - Opens a Leaflet map
 * - Listens to:
 *    • 'locationUpdate'  → latest bus coordinates (from driver)
 *    • 'tripStatus'      → {status: 'started'|'ended', at: <timestamp>}
 * - Draws the current position + a breadcrumb polyline
 * - Smoothly recenters on new locations
 * - Shows:
 *    • a Live / Offline pill (Live when trip started, Offline otherwise)
 *    • a status line ("Your trip has started/ended" or waiting message)
 *
 * NOTE:
 *   Put your MapTiler key in .env as REACT_APP_MAPTILER_KEY for production.
 *   Re-enable attribution per licensing when you go live.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import socket from '../../lib/socket';

// ---------- Leaflet marker icon fix (works in CRA/Vite bundlers) ----------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Use .env if available; fallback to your dev key during local runs
const MAPTILER_KEY = process.env.REACT_APP_MAPTILER_KEY || '9eLFBgrPYvv614T7WVu8';

/**
 * AutoCenter
 * Smoothly flies the map to the latest location whenever lat/lng changes.
 * Using a child component lets us access the Leaflet map instance via useMap().
 */
function AutoCenter({ lat, lng, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], zoom, { animate: true, duration: 0.75 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

export default function ParentDashboard() {
  // latest bus position
  const [location, setLocation] = useState(null); // { lat, lng }
  // breadcrumb trail for the current session (array of [lat, lng])
  const [trail, setTrail] = useState([]);
  // socket connection (not used for status; we derive status from tripStatus)
  const [connected, setConnected] = useState(socket.connected);

  // NEW: actual trip status we show to the user
  // 'idle'  → not started yet
  // 'started' → currently live
  // 'ended' → ended
  const [tripStatus, setTripStatus] = useState('idle');

  // avoid setting state after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Basic socket status (optional visual; we still show Live/Offline from tripStatus)
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    /**
     * 'locationUpdate' comes from backend whenever driver emits 'driverLocation'
     * We:
     *  - update marker position
     *  - append to polyline trail (capped length)
     *  - if we see location, force status → 'started'
     */
    const handleLocation = (payload) => {
      const { latitude, longitude } = payload || {};
      const lat = Number(latitude);
      const lng = Number(longitude);
      if (!mountedRef.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return;

      setLocation({ lat, lng });
      setTrail((prev) => {
        const next = [...prev, [lat, lng]];
        // keep it light
        return next.length > 500 ? next.slice(-500) : next;
      });

      // Seeing coordinates means the bus is currently live
      setTripStatus('started');
    };

    /**
     * 'tripStatus' is broadcast by backend when driver emits:
     *  - 'trip:start' → { status: 'started', at: ... }
     *  - 'trip:end'   → { status: 'ended',   at: ... }
     */
    const handleTripStatus = (message) => {
      if (!mountedRef.current) return;
      if (message?.status === 'started') setTripStatus('started');
      if (message?.status === 'ended') setTripStatus('ended');
    };

    socket.on('locationUpdate', handleLocation);
    socket.on('tripStatus', handleTripStatus);

    return () => {
      mountedRef.current = false;
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('locationUpdate', handleLocation);
      socket.off('tripStatus', handleTripStatus);
    };
  }, []);

  // Initial center until we get a real location (Guwahati fallback you used)
  const initialCenter = useMemo(
    () => (location ? [location.lat, location.lng] : [26.1573, 91.8173]),
    [location]
  );

  // Derive what to show
  const isLive = tripStatus === 'started';
  const statusLine =
    tripStatus === 'started'
      ? 'Your trip has started'
      : tripStatus === 'ended'
      ? 'Your trip has ended'
      : 'Waiting for the bus to start…';

  return (
    <div className="p-6">
      {/* Header + status pill */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Track Your Child’s Bus</h1>
        <span
          className={`text-sm px-2 py-0.5 rounded ${
            isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isLive ? 'Live' : 'Offline'}
        </span>
      </div>

      {/* Human-readable status line */}
      <p
        className={`mb-3 ${
          isLive ? 'text-green-700' : tripStatus === 'ended' ? 'text-red-700' : 'text-gray-600'
        }`}
      >
        {statusLine}
      </p>

      {/* Hide attribution for now. Re-enable with your license in production. */}
      <style>{`.leaflet-control-attribution{display:none !important}`}</style>

      <MapContainer
        center={initialCenter}
        zoom={15}
        attributionControl={false}
        style={{ height: 500, width: '100%', borderRadius: 12, overflow: 'hidden' }}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
          // attribution='&copy; MapTiler &copy; OpenStreetMap contributors'
        />

        {/* Breadcrumb trail */}
        {trail.length > 1 && (
          <Polyline positions={trail} pathOptions={{ color: 'royalblue', weight: 4, opacity: 0.85 }} />
        )}

        {/* Latest position marker + popup */}
        {location && (
          <>
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <div className="text-sm">
                  <div><strong>Bus location</strong></div>
                  <div>Lat: {location.lat.toFixed(6)}</div>
                  <div>Lng: {location.lng.toFixed(6)}</div>
                  <div>Updated: {new Date().toLocaleTimeString()}</div>
                </div>
              </Popup>
            </Marker>

            {/* Smoothly fly to the new point as it updates */}
            <AutoCenter lat={location.lat} lng={location.lng} zoom={16} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
