// src/pages/school/Trips.js
/**
 * School Trips (Live Tracking)
 * ---------------------------
 * - Receives:
 *    • 'locationUpdate' → { latitude, longitude, timestamp } from driver
 *    • 'tripStatus'     → { status: 'started'|'ended', at: <ts> } from server
 * - Shows "Live" only when the trip is started; otherwise "Offline".
 * - Shows a status line: "Your trip has started/ended/Waiting…".
 * - Draws a breadcrumb polyline of recent points (capped for performance).
 * - NO auto recentring. A top-right button lets users center on the bus on demand.
 *
 * Notes:
 *   • Move MAPTILER_KEY to an env var in production.
 *   • Re-enable attribution according to your tile provider’s license when you go live.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import socket from '../../lib/socket';

// ---- Leaflet default marker icon fix (works with CRA/Vite bundlers) ----
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ⚠️ Use process.env.REACT_APP_MAPTILER_KEY for production
const MAPTILER_KEY = '9eLFBgrPYvv614T7WVu8';

/**
 * Grabs the Leaflet map instance and passes it back up to the parent via setMapRef.
 * We keep it as a tiny child component so we can call useMap().
 */
function MapReady({ setMapRef }) {
  const map = useMap();
  useEffect(() => setMapRef(map), [map, setMapRef]);
  return null;
}

const Trips = () => {
  // Latest bus location
  const [location, setLocation] = useState(null); // { lat, lng }

  // Breadcrumb trail (array of [lat, lng]); we cap to avoid infinite growth
  const [path, setPath] = useState([]);

  // Socket connection UI (not the same as trip status)
  const [connected, setConnected] = useState(false);

  // Actual trip status we want to show users: 'idle'|'started'|'ended'
  const [tripStatus, setTripStatus] = useState('idle');

  // Store the Leaflet map instance so we can flyTo() when the user clicks "Center"
  const [mapRef, setMapRef] = useState(null);

  // Guard against setting state after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Socket connection (handy to debug; Live/Offline pill is driven by tripStatus)
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Location stream from driver
    const onLocation = (data) => {
      const { latitude, longitude } = data || {};
      const lat = Number(latitude);
      const lng = Number(longitude);
      if (!isMountedRef.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const point = { lat, lng };
      setLocation(point);
      setPath((prev) => {
        const next = [...prev, [lat, lng]];
        // cap last 600 points to keep it light
        return next.length > 600 ? next.slice(-600) : next;
      });

      // Seeing coordinates means the bus is live (extra safety)
      setTripStatus('started');
    };

    // Trip status broadcast from the backend
    const onTripStatus = (msg) => {
      if (!isMountedRef.current) return;
      if (msg?.status === 'started') setTripStatus('started');
      if (msg?.status === 'ended') setTripStatus('ended');
    };

    socket.on('locationUpdate', onLocation);
    socket.on('tripStatus', onTripStatus);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('locationUpdate', onLocation);
      socket.off('tripStatus', onTripStatus);
    };
  }, []);

  // Initial center (before first location arrives)
  const initialCenter = useMemo(
    () => (location ? [location.lat, location.lng] : [26.1573, 91.8173]), // fallback: your city center
    [location]
  );

  // Derived UI strings
  const isLive = tripStatus === 'started';
  const statusLine =
    tripStatus === 'started'
      ? 'Your trip has started'
      : tripStatus === 'ended'
      ? 'Your trip has ended'
      : 'Waiting for the bus to start…';

  // Click handler for the "Center on bus" button
  const centerOnBus = () => {
    if (mapRef && location) {
      mapRef.flyTo([location.lat, location.lng], 16, { animate: true, duration: 0.5 });
    }
  };

  return (
    <div className="p-8">
      {/* Header + Live/Offline pill (from tripStatus) */}
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Trip Tracking</h2>
        <span
          className={`text-sm px-2 py-0.5 rounded ${
            isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
          title={connected ? 'Socket connected' : 'Socket disconnected'}
        >
          {isLive ? 'Live' : 'Offline'}
        </span>
      </div>

      {/* Human-readable trip status line */}
      <p
        className={`mb-3 ${
          isLive ? 'text-green-700' : tripStatus === 'ended' ? 'text-red-700' : 'text-gray-600'
        }`}
      >
        {statusLine}
      </p>

      {/* Hide attribution while prototyping. Re-enable for production/licensing. */}
      <style>{`.leaflet-control-attribution{display:none !important}`}</style>

      {/* Position the Center button over the map: wrap map in a relative container */}
      <div className="relative" style={{ height: 500, width: '100%' }}>
        {/* Re-center button (only when we have a location) */}
        {location && (
          <button
            onClick={centerOnBus}
            className="absolute top-3 right-3 z-[1000] bg-white/90 hover:bg-white text-sm px-3 py-1.5 rounded shadow border"
            title="Center on bus"
          >
            Center on bus
          </button>
        )}

        <MapContainer
          center={initialCenter}
          zoom={15}
          attributionControl={false}
          style={{ height: '100%', width: '100%', borderRadius: 12, overflow: 'hidden' }}
        >
          {/* Grab map instance for the center button */}
          <MapReady setMapRef={setMapRef} />

          <TileLayer
            url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
            // attribution='&copy; MapTiler &copy; OpenStreetMap contributors'
          />

          {/* Draw the route so far */}
          {path.length > 1 && (
            <Polyline positions={path} pathOptions={{ color: 'royalblue', weight: 4, opacity: 0.85 }} />
          )}

          {/* Current bus marker */}
          {location && (
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
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Trips;
