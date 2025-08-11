// src/pages/drivers/DriverDashboard.js
/**
 * DriverDashboard
 * ---------------
 * - Starts continuous GPS tracking with geolocation.watchPosition
 * - Emits 'driverLocation' on every position update
 * - Emits 'trip:start' once when the trip begins
 * - Emits 'trip:end' once when the trip ends
 * - Applies your desktop correction offset when the screen is "large"
 */
import { useState, useEffect, useRef } from 'react';
import socket from '../../lib/socket';

const DriverDashboard = () => {
  const [tripStarted, setTripStarted] = useState(false);
  const [location, setLocation] = useState(null); // { latitude, longitude, timestamp }
  const watchIdRef = useRef(null);

  // Helper: stop the geolocation watcher if active
  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Start trip: announce start + begin watchPosition streaming
  const handleStartTrip = () => {
    setTripStarted(true);

    // Broadcast a one-time "trip started" message to everyone (parents/school)
    socket.emit('trip:start', { by: 'driver', timestamp: Date.now() });

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    // Desktop correction heuristic (you already used this)
    const isPC = window.innerWidth > 768;

    // Start continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        let { latitude, longitude } = position.coords;

        // Optional: correct desktop offset
        if (isPC) {
          latitude = latitude - 0.0046582;
          longitude = longitude - 0.0051996;
        }

        const updatedLocation = { latitude, longitude, timestamp: Date.now() };
        setLocation(updatedLocation);

        // Emit to backend; server will broadcast as 'locationUpdate'
        socket.emit('driverLocation', updatedLocation);
      },
      (error) => {
        console.error('❌ Error tracking location:', error);
      },
      {
        enableHighAccuracy: true, // best location we can get
        maximumAge: 1000,         // how long a cached position is allowed
        timeout: 10000,           // how long to wait for a new fix
      }
    );
  };

  // End trip: announce end + stop streaming
  const handleEndTrip = () => {
    setTripStarted(false);

    // Broadcast a one-time "trip ended" message
    socket.emit('trip:end', { by: 'driver', timestamp: Date.now() });

    // Stop geolocation tracking
    stopWatching();

    setLocation(null);
  };

  // Safety: if component unmounts while trip is running, stop the watcher
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">Driver Dashboard</h1>

      {!tripStarted ? (
        <button
          onClick={handleStartTrip}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow"
        >
          Start Trip
        </button>
      ) : (
        <button
          onClick={handleEndTrip}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow"
        >
          End Trip
        </button>
      )}

      {tripStarted && location && (
        <div className="mt-6 text-gray-700">
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
