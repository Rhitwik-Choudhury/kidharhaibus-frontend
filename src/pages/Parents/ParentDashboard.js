import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  GoogleMap,
  Marker,
  Polyline,
  LoadScript,
  Autocomplete
} from '@react-google-maps/api';

import socket from '../../lib/socket';
import { parentAPI } from '../../services/api';
import { useAuth } from "../../context/AuthContext";

const containerStyle = {
  height: 500,
  width: '100%',
  borderRadius: 12,
  overflow: 'hidden',
};

export default function ParentDashboard() {

  const { user } = useAuth();

  const mapRef = useRef(null);
  const autoCompleteRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [savedPickup, setSavedPickup] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [trail, setTrail] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [tripStatus, setTripStatus] = useState('idle');
  const [busId, setBusId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // ================= FETCH BUS =================
  useEffect(() => {
    const fetchMyBus = async () => {
      try {
        setLoading(true);

        const { data } = await parentAPI.getMyBus();

        const bus = data?.bus || null;
        const parent = data?.parent || null;

        setBusId(bus?._id || null);

        if (bus?.currentLocation) {
          setLocation({
            lat: Number(bus.currentLocation.lat),
            lng: Number(bus.currentLocation.lng),
          });
        }

        // ✅ LOAD SAVED PICKUP LOCATION
        if (parent?.stopLocation) {
          const saved = {
            lat: parent.stopLocation.lat,
            lng: parent.stopLocation.lng,
          };
          setSavedPickup(saved);
        }

        if (bus?.tripStatus) {
          setTripStatus(bus.tripStatus);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBus();
  }, []);

  // ================= SOCKET =================
  useEffect(() => {
    if (!busId) return;

    if (socket.connected) {
      socket.emit('joinBusRoom', { busId });
    }

    socket.on('connect', () => {
      socket.emit('joinBusRoom', { busId });
    });

    socket.on('location-update', ({ busId: id, lat, lng }) => {
      if (String(id) !== String(busId)) return;

      const newLoc = { lat: Number(lat), lng: Number(lng) };

      setLocation(newLoc);
      setTrail(prev => [...prev.slice(-500), newLoc]);
      setTripStatus('started');
    });

    socket.on('tripStatus', (msg) => {
      if (String(msg.busId) !== String(busId)) return;
      setTripStatus(msg.status);
    });

    return () => {
      socket.emit('leaveBusRoom', { busId });
    };

  }, [busId]);

  // ================= ALERT =================
  useEffect(() => {
    const handleAlert = (data) => {
      console.log("🔔 ALERT:", data);

      if (!window.lastAlert || window.lastAlert !== data.message) {
        alert(data.message);
        window.lastAlert = data.message;
      }
    };

    socket.on("alert", handleAlert);
    return () => socket.off("alert", handleAlert);
  }, []);

  // ================= INITIAL MODAL LOCATION =================
  useEffect(() => {
    if (showLocationModal) {
      if (savedPickup) {
        setSelectedLocation(savedPickup);
      } else if (location) {
        setSelectedLocation(location);
      }
    }
  }, [showLocationModal]);

  // ================= SAVE LOCATION =================
  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      alert("Select location first");
      return;
    }

    try {
      await parentAPI.setLocation(selectedLocation);
      alert("Location saved!");
      setShowLocationModal(false);
      setSavedPickup(selectedLocation);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SEARCH HANDLER =================
  const onPlaceChanged = () => {
    const place = autoCompleteRef.current.getPlace();

    if (!place.geometry) return;

    const loc = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setSelectedLocation(loc);

    mapRef.current.panTo(loc);
  };

  const center = useMemo(
    () => location || { lat: 26.1573, lng: 91.8173 },
    [location]
  );

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <div className="p-6">

        <h1 className="text-xl font-bold mb-3">Track Your Child’s Bus</h1>

        <p>
          {loading
            ? "Loading..."
            : tripStatus === "started"
            ? "Your child’s bus trip has started"
            : tripStatus === "ended"
            ? "Your child’s bus trip has ended"
            : "Waiting for bus..."}
        </p>

        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {trail.length > 1 && (
            <Polyline path={trail} options={{ strokeColor: "#2563eb" }} />
          )}
          {location && <Marker position={location} />}
        </GoogleMap>

        <button
          onClick={() => setShowLocationModal(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Set Pickup Location
        </button>

        <div className="mt-3 text-sm">
          Socket: {connected ? "Connected" : "Disconnected"}
        </div>

        {/* ================= MODAL ================= */}
        {showLocationModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}>
            <div style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              width: "90%",
              maxWidth: 400
            }}>
              <h3>Select Pickup Location</h3>

              {/* 🔍 SEARCH BOX */}
              <Autocomplete
                onLoad={(ref) => (autoCompleteRef.current = ref)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Search location..."
                  style={{
                    width: "100%",
                    height: 40,
                    marginBottom: 10,
                    padding: "0 10px",
                    border: "1px solid #ccc",
                    borderRadius: 6
                  }}
                />
              </Autocomplete>

              <GoogleMap
                mapContainerStyle={{ height: 300, width: "100%" }}
                center={selectedLocation || center}
                zoom={15}
                onLoad={(map) => (mapRef.current = map)}
                onClick={(e) => {
                  setSelectedLocation({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                }}
              >
                <Marker
                  position={selectedLocation || center}
                  draggable={true}
                  onDragEnd={(e) => {
                    setSelectedLocation({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    });
                  }}
                />
              </GoogleMap>

              <div style={{ marginTop: 10 }}>
                <button onClick={handleConfirmLocation}>
                  Confirm
                </button>

                <button
                  onClick={() => setShowLocationModal(false)}
                  style={{ marginLeft: 10 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </LoadScript>
  );
}