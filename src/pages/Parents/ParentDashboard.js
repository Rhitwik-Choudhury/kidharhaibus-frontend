import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import socket from '../../lib/socket';
import { parentAPI } from '../../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MAPTILER_KEY = process.env.REACT_APP_MAPTILER_KEY || '9eLFBgrPYvv614T7WVu8';

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
  const [location, setLocation] = useState(null);
  const [trail, setTrail] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [tripStatus, setTripStatus] = useState('idle');
  const [busId, setBusId] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchMyBus = async () => {
      try {
        setLoading(true);
        const { data } = await parentAPI.getMyBus();

        const student = data?.student || null;
        const bus = data?.bus || null;

        if (!mountedRef.current) return;

        setStudentInfo(student);
        setBusInfo(bus);
        setBusId(bus?._id || null);

        if (bus?.currentLocation?.lat != null && bus?.currentLocation?.lng != null) {
          setLocation({
            lat: Number(bus.currentLocation.lat),
            lng: Number(bus.currentLocation.lng),
          });
        }

        if (bus?.tripStatus) {
          setTripStatus(bus.tripStatus);
        }
      } catch (error) {
        console.error('Failed to fetch parent bus:', error);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchMyBus();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!busId) return;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.emit('joinBusRoom', { busId });

    const handleLocation = (payload) => {
      const { busId: incomingBusId, lat, lng } = payload || {};

      if (!mountedRef.current) return;
      if (String(incomingBusId) !== String(busId)) return;

      const parsedLat = Number(lat);
      const parsedLng = Number(lng);

      if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return;

      setLocation({ lat: parsedLat, lng: parsedLng });
      setTrail((prev) => {
        const next = [...prev, [parsedLat, parsedLng]];
        return next.length > 500 ? next.slice(-500) : next;
      });

      setTripStatus('started');
    };

    const handleTripStatus = (message) => {
      if (!mountedRef.current) return;
      if (String(message?.busId) !== String(busId)) return;

      if (message?.status === 'started') setTripStatus('started');
      if (message?.status === 'ended') setTripStatus('ended');
      if (message?.status === 'idle') setTripStatus('idle');
    };

    socket.on('busLocationUpdated', handleLocation);
    socket.on('tripStatus', handleTripStatus);

    return () => {
      socket.emit('leaveBusRoom', { busId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('busLocationUpdated', handleLocation);
      socket.off('tripStatus', handleTripStatus);
    };
  }, [busId]);

  const initialCenter = useMemo(
    () => (location ? [location.lat, location.lng] : [26.1573, 91.8173]),
    [location]
  );

  const isLive = tripStatus === 'started';

  const statusLine =
    !busId
      ? 'No bus is linked to your child yet.'
      : tripStatus === 'started'
      ? 'Your child’s bus trip has started'
      : tripStatus === 'ended'
      ? 'Your child’s bus trip has ended'
      : 'Waiting for the bus to start…';

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Track Your Child’s Bus</h1>
          {studentInfo && (
            <p className="text-sm text-gray-600 mt-1">
              Student: {studentInfo.name} {studentInfo.studentCode ? `• ${studentInfo.studentCode}` : ''}
            </p>
          )}
          {busInfo && (
            <p className="text-sm text-gray-600">
              Bus: {busInfo.busNumber} • Route: {busInfo.route}
            </p>
          )}
        </div>

        <span
          className={`text-sm px-3 py-1 rounded ${
            isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isLive ? 'Live' : 'Offline'}
        </span>
      </div>

      <p
        className={`mb-3 ${
          isLive ? 'text-green-700' : tripStatus === 'ended' ? 'text-red-700' : 'text-gray-600'
        }`}
      >
        {loading ? 'Loading your child’s bus...' : statusLine}
      </p>

      <style>{`.leaflet-control-attribution{display:none !important}`}</style>

      <MapContainer
        center={initialCenter}
        zoom={15}
        attributionControl={false}
        style={{ height: 500, width: '100%', borderRadius: 12, overflow: 'hidden' }}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />

        {trail.length > 1 && (
          <Polyline positions={trail} pathOptions={{ color: 'royalblue', weight: 4, opacity: 0.85 }} />
        )}

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

            <AutoCenter lat={location.lat} lng={location.lng} zoom={16} />
          </>
        )}
      </MapContainer>

      {!loading && !busId && (
        <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
          Your parent account is not linked to any student/bus yet. Please sign up with a valid student code or ask the school to verify the linkage.
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Socket: {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}