// src/pages/drivers/DriverDashboard.js
/**
 * DriverDashboard
 * ---------------
 * - Start/end a trip and continuously stream GPS using geolocation.watchPosition
 * - Emits socket events:
 *      • 'trip:start' exactly once when starting (and NOT again on refresh)
 *      • 'driverLocation' on each position update
 *      • 'trip:end' exactly once when ending
 * - Shows a tri-lingual banner: “Don't close this tab or lock your phone”
 * - Persists "trip active" across reloads (localStorage)
 * - Optional: requests a Wake Lock to keep the screen on (while the tab is open)
 * - Applies your desktop correction offset when the screen is "large"
 */

import { useState, useEffect, useRef } from 'react';
import socket from '../../lib/socket';
import TripLockWarning from './TripLockWarning';

const STORAGE_KEY = 'khb_trip_active';

const DriverDashboard = () => {
  // Initialize from localStorage so refresh keeps the banner visible
  const [tripStarted, setTripStarted] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  );
  const [location, setLocation] = useState(null); // { latitude, longitude, timestamp }

  // Geolocation watcher id
  const watchIdRef = useRef(null);

  // Wake Lock (optional – keeps screen from sleeping while tab is visible)
  const wakeLockRef = useRef(null);
  const visListenerRef = useRef(null);

  /** -------------------------
   * Wake Lock helpers (optional)
   * --------------------------*/
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        // Request a screen wake lock
        wakeLockRef.current = await navigator.wakeLock.request('screen');

        // If the tab goes to background and comes back, re-request
        visListenerRef.current = async () => {
          if (document.visibilityState === 'visible' && !wakeLockRef.current) {
            try {
              wakeLockRef.current = await navigator.wakeLock.request('screen');
            } catch {
              /* ignore */
            }
          }
        };
        document.addEventListener('visibilitychange', visListenerRef.current);
      }
    } catch {
      // Wake Lock is best-effort; we quietly ignore errors
    }
  };

  const releaseWakeLock = () => {
    try {
      wakeLockRef.current?.release();
    } catch {
      /* ignore */
    }
    wakeLockRef.current = null;

    if (visListenerRef.current) {
      document.removeEventListener('visibilitychange', visListenerRef.current);
      visListenerRef.current = null;
    }
  };

  /** -------------------------
   * Geolocation helpers
   * --------------------------*/
  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Start the geolocation stream. If announce=true, emit 'trip:start' once.
  const startWatching = ({ announce } = { announce: true }) => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    // Mark trip active and persist
    setTripStarted(true);
    localStorage.setItem(STORAGE_KEY, '1');

    // Only the first, user-initiated start should announce to everyone
    if (announce) {
      socket.emit('trip:start', { by: 'driver', timestamp: Date.now() });
    }

    // Optional: keep the screen awake while tab is open
    requestWakeLock();

    // Apply your desktop correction if the viewport is wide
    const isPC = window.innerWidth > 768;

    // Start continuous location updates
    if (watchIdRef.current === null) {
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

          // Push to the server; it will broadcast 'locationUpdate'
          socket.emit('driverLocation', updatedLocation);
        },
        (error) => {
          console.error('❌ Error tracking location:', error);
        },
        {
          enableHighAccuracy: true, // best accuracy when available
          maximumAge: 1000,         // reuse a fix up to 1s old
          timeout: 10000,           // give up if no fix in 10s
        }
      );
    }
  };

  const handleStartTrip = () => {
    // Real user intent – announce start to everyone
    startWatching({ announce: true });
  };

  const handleEndTrip = () => {
    // Announce end once
    socket.emit('trip:end', { by: 'driver', timestamp: Date.now() });

    // Stop tracking + clear UI
    stopWatching();
    releaseWakeLock();
    setLocation(null);

    // Clear "trip active"
    setTripStarted(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // On mount: if a trip was active before a refresh, resume tracking
  // without re-announcing 'trip:start'.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1' && watchIdRef.current === null) {
      startWatching({ announce: false });
    }
    // Cleanup on unmount
    return () => {
      stopWatching();
      releaseWakeLock();
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
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
        </div>
      )}

      {/* Tri-lingual banner that appears whenever a trip is active */}
      <TripLockWarning visible={tripStarted} />
    </div>
  );
};

export default DriverDashboard;
