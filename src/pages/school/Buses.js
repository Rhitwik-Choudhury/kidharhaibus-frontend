// src/pages/school/Buses.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Buses = () => {
  const { user, token } = useAuth();
  console.log("Token:", token);
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: "",
    carNumber: "",
    route: "",
    capacity: "",
  });

  // Fetch buses on mount
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/school/buses?schoolId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuses(res.data);
      } catch (err) {
        console.error("Failed to fetch buses:", err);
      }
    };
    fetchBuses();
  }, [user?.id, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new bus
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, schoolId: user.id };
      const res = await axios.post("http://localhost:5000/api/school/buses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses((prev) => [...prev, res.data]);
      setFormData({ busNumber: "", carNumber: "", route: "", capacity: "" });
    } catch (err) {
      console.error("Failed to add bus:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Buses</h1>

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
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Bus
        </button>
      </form>

      {/* Bus list table */}
      {buses.length > 0 && (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Bus No</th>
              <th className="px-4 py-2">Car No</th>
              <th className="px-4 py-2">Driver</th>
              <th className="px-4 py-2">Route</th>
              <th className="px-4 py-2">Students</th>
              <th className="px-4 py-2">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{bus.busNumber}</td>
                <td className="px-4 py-2">{bus.carNumber}</td>
                <td className="px-4 py-2">{bus.driver ? bus.driver.name : "Not Assigned"}</td>
                <td className="px-4 py-2">{bus.route}</td>
                <td className="px-4 py-2">{bus.studentCount}</td>
                <td className="px-4 py-2">{bus.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default Buses;
