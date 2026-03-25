import { useState, useEffect, useRef } from "react";
import socket from "../../lib/socket";
import TripLockWarning from "./TripLockWarning";
import { useAuth } from "../../context/AuthContext";
import { handleAPIError } from "../../services/api";
import axios from "axios";

const STORAGE_KEY = "khb_trip_active";

const DriverDashboard = () => {
  const { user } = useAuth();

  const [driverData, setDriverData] = useState({
    driverId: user?.id || user?._id || null,
    busId: null,
    fullName: user?.fullName || "",
  });

  const [busInfo, setBusInfo] = useState(null);
  const [tripStarted, setTripStarted] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "1"
  );
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const watchIdRef = useRef(null);

  // ================= FETCH DRIVER BUS =================
  const fetchDriverBus = async () => {
    try {
      const token = localStorage.getItem("kidharhaibus_token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/driver/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const driver = res.data?.driver;

      if (!driver) return;

      const bus = driver.busId;

      setDriverData({
        driverId: driver._id,
        busId: bus?._id || null,
        fullName: driver.fullName,
      });

      setBusInfo(bus || null);

      // 🔥 also update localStorage (important)
      const updatedUser = {
        ...user,
        busId: bus?._id || null,
      };
      localStorage.setItem("kidharhaibus_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to fetch driver bus:", err);
    }
  };

  useEffect(() => {
    fetchDriverBus();
  }, []);

  // ================= STOP WATCH =================
  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // ================= START TRACKING =================
  const startWatching = ({ announce } = { announce: true }) => {
    const { driverId, busId } = driverData;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    if (!driverId) {
      setError("Driver not found.");
      return;
    }

    if (!busId) {
      setError("No bus assigned.");
      return;
    }

    setError("");
    setTripStarted(true);
    localStorage.setItem(STORAGE_KEY, "1");

    if (announce) {
      socket.emit("trip:start", { driverId, busId });
    }

    if (watchIdRef.current === null) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const updatedLocation = {
            driverId,
            busId,
            lat: latitude,
            lng: longitude,
          };

          setLocation(updatedLocation);

          socket.emit("driverLocation", updatedLocation);
        },
        (err) => {
          console.error(err);
          setError("Location error");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleStartTrip = () => {
    startWatching({ announce: true });
  };

  const handleEndTrip = () => {
    const { driverId, busId } = driverData;

    if (driverId && busId) {
      socket.emit("trip:end", { driverId, busId });
    }

    stopWatching();
    setTripStarted(false);
    setLocation(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // ================= RESUME TRIP =================
  useEffect(() => {
    if (
      localStorage.getItem(STORAGE_KEY) === "1" &&
      driverData.driverId &&
      driverData.busId
    ) {
      startWatching({ announce: false });
    }

    return () => stopWatching();
  }, [driverData]);

  // ================= SOCKET ERROR =================
  useEffect(() => {
    socket.on("trackingError", (payload) => {
      setError(payload?.message || "Tracking error");
    });

    return () => socket.off("trackingError");
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-3 text-orange-600">
        Driver Dashboard
      </h1>

      {/* DRIVER + BUS INFO */}
      <div className="mb-6 border p-4 rounded text-left">
        <p>
          <strong>Driver:</strong> {driverData.fullName}
        </p>

        <p>
          <strong>Bus:</strong>{" "}
          {busInfo ? busInfo.busNumber : "Not Assigned"}
        </p>

        <p>
          <strong>Route:</strong>{" "}
          {busInfo ? busInfo.route : "N/A"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {tripStarted ? "Running" : "Not Started"}
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 text-red-600">
          {handleAPIError({ message: error })}
        </div>
      )}

      {/* BUTTON */}
      {!tripStarted ? (
        <button
          onClick={handleStartTrip}
          disabled={!driverData.busId}
          className="bg-green-500 text-white px-6 py-3 rounded"
        >
          Start Trip
        </button>
      ) : (
        <button
          onClick={handleEndTrip}
          className="bg-red-500 text-white px-6 py-3 rounded"
        >
          End Trip
        </button>
      )}

      {/* LOCATION */}
      {location && (
        <div className="mt-4">
          <p>Lat: {location.lat}</p>
          <p>Lng: {location.lng}</p>
        </div>
      )}

      <TripLockWarning visible={tripStarted} />

      {!driverData.busId && (
        <p className="mt-4 text-yellow-700">
          No bus assigned. Contact school.
        </p>
      )}
    </div>
  );
};

export default DriverDashboard;