import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline, LoadScript } from '@react-google-maps/api';
import socket from '../../lib/socket';
import { parentAPI } from '../../services/api';
import { useAuth } from "../../context/AuthContext"; // ✅ ADDED

const containerStyle = {
  height: 500,
  width: '100%',
  borderRadius: 12,
  overflow: 'hidden',
};

export default function ParentDashboard() {

  const { user } = useAuth(); // ✅ ADDED

  const lastUpdateRef = useRef(Date.now());
  const [location, setLocation] = useState(null);
  const [trail, setTrail] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [tripStatus, setTripStatus] = useState('idle');
  const [busId, setBusId] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapRef = useRef(null);
  const mountedRef = useRef(true);

  // ================= FETCH BUS =================
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

  // ================= SOCKET =================
  useEffect(() => {
    if (!busId) return;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleLocation = (payload) => {
      const { busId: incomingBusId, lat, lng } = payload || {};

      if (!mountedRef.current) return;
      if (String(incomingBusId) !== String(busId)) return;

      const parsedLat = Number(lat);
      const parsedLng = Number(lng);

      if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return;

      const newLoc = { lat: parsedLat, lng: parsedLng };

      setLocation(newLoc);
      lastUpdateRef.current = Date.now();

      setTrail((prev) => {
        const next = [...prev, newLoc];
        return next.length > 500 ? next.slice(-500) : next;
      });

      setTripStatus('started');

      if (mapRef.current) {
        mapRef.current.panTo(newLoc);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.on('connect', () => {
      console.log("✅ Connected, joining room:", busId);
      socket.emit('joinBusRoom', { busId });
    });

    socket.on('location-update', handleLocation);
    socket.on('busLocationUpdated', handleLocation);

    const handleTripStatus = (message) => {
      if (!mountedRef.current) return;
      if (String(message?.busId) !== String(busId)) return;

      if (message?.status === 'started') setTripStatus('started');
      if (message?.status === 'ended') setTripStatus('ended');
      if (message?.status === 'idle') setTripStatus('idle');
    };

    socket.on('tripStatus', handleTripStatus);

    return () => {
      socket.emit('leaveBusRoom', { busId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('location-update', handleLocation);
      socket.off('tripStatus', handleTripStatus);
    };
  }, [busId]);

  // ================= ALERT LISTENER (NEW) =================
  useEffect(() => {
    if (!user) return;

    const handleAlert = (data) => {
      console.log("🔔 ALERT RECEIVED:", data);

      if (data.parentId && String(data.parentId) !== String(user.id)) return;

      alert(data.message);
    };

    socket.on("alert", handleAlert);

    return () => {
      socket.off("alert", handleAlert);
    };
  }, [user]);

  // ================= STATUS TIMER =================
  useEffect(() => {
    const interval = setInterval(() => {
      if (!location) return;

      const diff = Date.now() - lastUpdateRef.current;

      if (diff > 10000 && diff <= 60000) {
        setTripStatus("stopped");
      }

      if (diff > 60000) {
        setTripStatus("offline");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [location]);

  // ================= LOCATION MODAL =================
  useEffect(() => {
    if (showLocationModal && location) {
      setSelectedLocation(location);
    }
  }, [showLocationModal]);

  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }

    try {
      await parentAPI.setLocation(selectedLocation);
      alert("Location saved successfully!");
      setShowLocationModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save location");
    }
  };

  const initialCenter = useMemo(
    () => (location ? location : { lat: 26.1573, lng: 91.8173 }),
    [location]
  );

  const isLive = tripStatus === 'started' || tripStatus === 'stopped';
  const isOffline = tripStatus === 'offline';

  const statusLine =
    !busId
      ? 'No bus is linked to your child yet.'
      : isOffline
      ? 'Bus is currently offline'
      : tripStatus === 'started'
      ? 'Your child’s bus trip has started'
      : tripStatus === 'stopped'
      ? 'Bus is currently stopped (traffic/pickup)'
      : tripStatus === 'ended'
      ? 'Your child’s bus trip has ended'
      : 'Waiting for the bus to start…';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Track Your Child’s Bus</h1>

      <p className="mb-3">{loading ? 'Loading...' : statusLine}</p>

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={initialCenter} zoom={15}>
          {trail.length > 1 && <Polyline path={trail} options={{ strokeColor: '#2563eb' }} />}
          {location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>

      <button
        onClick={() => setShowLocationModal(true)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Set Pickup Location
      </button>

      <div className="mt-4 text-xs text-gray-500">
        Socket: {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}