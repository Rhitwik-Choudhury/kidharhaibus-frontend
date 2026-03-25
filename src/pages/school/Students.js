import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { studentsAPI, busesAPI } from "../../services/api";

const Students = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    studentClass: "",
    rollNumber: "",
    address: "",
    busId: "",
    code: "",
  });

  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    try {
      const schoolId = user?._id || user?.id;
      if (!schoolId) return;

      const res = await studentsAPI.getStudents({ schoolId });
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  // ================= FETCH BUSES =================
  const fetchBuses = async () => {
    try {
      const schoolId = user?._id || user?.id;
      if (!schoolId) return;

      const res = await busesAPI.getBuses({ schoolId });
      setBuses(res.data?.buses || []);
    } catch (err) {
      console.error("Failed to fetch buses:", err);
    }
  };

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchStudents();
      fetchBuses();
    }
  }, [user]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= GENERATE CODE =================
  const generateStudentCode = () => {
    const { name, studentClass } = formData;
    const schoolName = user?.schoolName || "";

    if (!schoolName || !name || !studentClass) {
      alert("Enter school name, student name, and class first.");
      return;
    }

    const schoolCode = schoolName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);

    const [firstName = "", lastName = ""] = name.trim().split(" ");

    const firstCode = firstName.slice(0, 3).toUpperCase();
    const lastCode = lastName.slice(0, 3).toUpperCase();
    const classCode = String(studentClass).padStart(2, "0");

    const code = `${schoolCode}-${firstCode}-${lastCode}-${classCode}`;

    setFormData((prev) => ({ ...prev, code }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const schoolId = user._id || user.id;

    const payload = {
      name: formData.name,
      class: formData.studentClass,
      roll: formData.rollNumber,
      address: formData.address,
      busId: formData.busId,
      studentCode: formData.code,
      schoolId,
    };

    try {
      if (editingId) {
        await studentsAPI.updateStudent(editingId, payload);
      } else {
        await studentsAPI.createStudent(payload);
      }

      await fetchStudents();

      setEditingId(null);
      setFormData({
        name: "",
        studentClass: "",
        rollNumber: "",
        address: "",
        busId: "",
        code: "",
      });
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      studentClass: student.class,
      rollNumber: student.roll,
      address: student.address,
      busId: student.busId?._id || "",
      code: student.studentCode,
    });
    setEditingId(student._id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await studentsAPI.deleteStudent(id);
      await fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-6">
        {editingId ? "Edit Student" : "Add New Student"}
      </h1>

      {/* ================= FORM ================= */}
      <form
        className="bg-white rounded-lg shadow-md p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Enter Student Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            name="studentClass"
            placeholder="Enter Class (e.g. 06)"
            value={formData.studentClass}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="number"
            name="rollNumber"
            placeholder="Enter Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <select
            name="busId"
            value={formData.busId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Bus</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.busNumber}
              </option>
            ))}
          </select>

        </div>

        <textarea
          name="address"
          placeholder="Enter Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <div className="flex gap-2">
          <input
            type="text"
            name="code"
            placeholder="Student Code"
            value={formData.code}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <button
            type="button"
            onClick={generateStudentCode}
            className="bg-gray-300 px-4 rounded hover:bg-gray-400"
          >
            Generate Code
          </button>
        </div>

        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Student" : "Add Student"}
        </motion.button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Student List
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-500">No students added yet.</p>
        ) : (
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
            
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600 uppercase">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Roll</th>
                <th className="px-6 py-3">Bus</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((stu) => (
                <tr
                  key={stu._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3 font-medium">{stu.name}</td>
                  <td className="px-6 py-3">{stu.class}</td>
                  <td className="px-6 py-3">{stu.roll}</td>
                  <td className="px-6 py-3">
                    {stu.busId?.busNumber || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-blue-600 font-semibold">
                    {stu.studentCode}
                  </td>

                  <td className="px-6 py-3 flex gap-2 justify-center">
                    
                    <button
                      onClick={() => handleEdit(stu)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(stu._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default Students;