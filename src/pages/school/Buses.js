import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { busesAPI, handleAPIError } from "../../services/api";
import { driversAPI } from "../../services/api"; 

const Buses = () => {
  const { user } = useAuth();

  const schoolId = user?.id || user?._id;

  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    busNumber: "",
    carNumber: "",
    route: "",
    capacity: "",
  });

  const [assignments, setAssignments] = useState({});

  const setRowLoading = (busId, value) => {
    setActionLoading((prev) => ({ ...prev, [busId]: value }));
  };

  const fetchBuses = async () => {
    try {
      if (!schoolId) return;
      const res = await busesAPI.getBuses({ schoolId });
      setBuses(res.data?.buses || []);
    } catch (err) {
      console.error("Failed to fetch buses:", err);
      setError(handleAPIError(err));
    }
  };

  const fetchDrivers = async () => {
    try {
      if (!schoolId) return;

      const res = await driversAPI.getDrivers(schoolId);

      // Only show drivers without bus assigned
      const unassigned = (res.data?.drivers || []).filter(
        (d) => !d.busId
      );

      setDrivers(unassigned);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
      setError(handleAPIError(err));
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchBuses(), fetchDrivers()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [schoolId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignmentChange = (busId, driverId) => {
    setAssignments((prev) => ({
      ...prev,
      [busId]: driverId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!schoolId) {
        alert("School not found. Please log in again.");
        return;
      }

      setSubmitting(true);
      setError("");

      const payload = {
        ...formData,
        schoolId,
        capacity: Number(formData.capacity),
      };

      await busesAPI.createBus(payload);

      setFormData({
        busNumber: "",
        carNumber: "",
        route: "",
        capacity: "",
      });

      await fetchAllData();
    } catch (err) {
      console.error("Failed to add bus:", err);
      const message = handleAPIError(err);
      setError(message);
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (busId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this bus?")) return;

      setRowLoading(busId, true);
      setError("");

      await busesAPI.deleteBus(busId);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to delete bus:", err);
      const message = handleAPIError(err);
      setError(message);
      alert(message);
    } finally {
      setRowLoading(busId, false);
    }
  };

  const handleAssignDriver = async (busId) => {
    try {
      const selectedDriverId = assignments[busId];
      if (!selectedDriverId) {
        alert("Please select a driver first.");
        return;
      }

      setRowLoading(busId, true);
      setError("");

      await busesAPI.assignDriver(busId, selectedDriverId);

      setAssignments((prev) => {
        const next = { ...prev };
        delete next[busId];
        return next;
      });

      await fetchAllData();
    } catch (err) {
      console.error("Failed to assign driver:", err);
      const message = handleAPIError(err);
      setError(message);
      alert(message);
    } finally {
      setRowLoading(busId, false);
    }
  };

  const handleRemoveDriver = async (busId) => {
    try {
      if (!window.confirm("Remove the assigned driver from this bus?")) return;

      setRowLoading(busId, true);
      setError("");

      await busesAPI.removeDriver(busId);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to remove driver:", err);
      const message = handleAPIError(err);
      setError(message);
      alert(message);
    } finally {
      setRowLoading(busId, false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Buses</h1>

      {error ? (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="busNumber"
            value={formData.busNumber}
            onChange={handleChange}
            placeholder="Bus Number"
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="carNumber"
            value={formData.carNumber}
            onChange={handleChange}
            placeholder="Car Number"
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="route"
            value={formData.route}
            onChange={handleChange}
            placeholder="Route (Address)"
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="border p-2 rounded"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add Bus"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading buses...</p>
      ) : buses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Bus No</th>
                <th className="px-4 py-2 text-left">Car No</th>
                <th className="px-4 py-2 text-left">Driver</th>
                <th className="px-4 py-2 text-left">Assign Driver</th>
                <th className="px-4 py-2 text-left">Route</th>
                <th className="px-4 py-2 text-left">Students</th>
                <th className="px-4 py-2 text-left">Capacity</th>
                <th className="px-4 py-2 text-left">Trip</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {buses.map((bus) => {
                const assignedDriver = bus.driverId;
                const isBusy = !!actionLoading[bus._id];

                return (
                  <tr key={bus._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{bus.busNumber}</td>
                    <td className="px-4 py-2">{bus.carNumber}</td>

                    <td className="px-4 py-2">
                      {assignedDriver?.fullName || "Not Assigned"}
                    </td>

                    <td className="px-4 py-2">
                      {assignedDriver ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDriver(bus._id)}
                          disabled={isBusy}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-60"
                        >
                          Remove Driver
                        </button>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <select
                            value={assignments[bus._id] || ""}
                            onChange={(e) =>
                              handleAssignmentChange(bus._id, e.target.value)
                            }
                            className="border p-2 rounded min-w-[180px]"
                            disabled={isBusy}
                          >
                            <option value="">Select driver</option>
                            {drivers.map((driver) => (
                              <option key={driver._id} value={driver._id}>
                                {driver.fullName} ({driver.email})
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleAssignDriver(bus._id)}
                            disabled={isBusy || !assignments[bus._id]}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-60"
                          >
                            Assign
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2">{bus.route}</td>
                    <td className="px-4 py-2">{bus.studentCount}</td>
                    <td className="px-4 py-2">{bus.capacity}</td>
                    <td className="px-4 py-2 capitalize">{bus.tripStatus || "idle"}</td>

                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(bus._id)}
                        disabled={isBusy}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No buses added yet.</p>
      )}
    </div>
  );
};

export default Buses;