import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

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

    const code = `${schoolCode}${firstCode}${lastCode}${classCode}`;

    setFormData((prev) => ({
      ...prev,
      code,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const schoolId = user?._id || user?.id;

    if (!schoolId) {
      alert("School information is unavailable. Please log in again.");
      return;
    }

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
      name: student.name || "",
      studentClass: student.class || "",
      rollNumber: student.roll || "",
      address: student.address || "",
      busId: student.busId?._id || "",
      code: student.studentCode || "",
    });

    setEditingId(student._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await studentsAPI.deleteStudent(id);
      await fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ================= SEARCH / FILTER =================
  const filteredStudents = students.filter((student) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return true;

    return (
      student.name?.toLowerCase().includes(query) ||
      String(student.roll || "").toLowerCase().includes(query) ||
      student.studentCode?.toLowerCase().includes(query) ||
      String(student.class || "").toLowerCase().includes(query) ||
      student.busId?.busNumber?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ================= FORM HEADING ================= */}
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

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            name="code"
            placeholder="Generate the student code"
            value={formData.code}
            readOnly
            required
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed uppercase"
          />

          <button
            type="button"
            onClick={generateStudentCode}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 whitespace-nowrap"
          >
            Generate Code
          </button>
        </div>

        <div className="flex gap-3">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Student" : "Add Student"}
          </motion.button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);

                setFormData({
                  name: "",
                  studentClass: "",
                  rollNumber: "",
                  address: "",
                  busId: "",
                  code: "",
                });
              }}
              className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= STUDENT MANAGEMENT ================= */}
      <div className="mt-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Students
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {students.length}{" "}
              {students.length === 1 ? "student" : "students"} registered
            </p>
          </div>
        </div>

        {/* Search */}
        {students.length > 0 && (
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll number, class, bus or student code..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}

        {/* Search result count */}
        {searchTerm && students.length > 0 && (
          <p className="text-sm text-gray-500 mb-3">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        )}

        {/* Empty state */}
        {students.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="font-medium text-gray-600">
              No students added yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Students you add will appear here.
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <Search
              className="mx-auto mb-3 text-gray-400"
              size={28}
            />

            <p className="font-medium text-gray-600">
              No students found
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Try searching with a different name, roll number, class,
              bus or student code.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full min-w-[800px] border-collapse bg-white">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm text-gray-600 uppercase">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Roll</th>
                  <th className="px-6 py-3">Bus</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((stu) => (
                  <tr
                    key={stu._id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {stu.name}
                    </td>

                    <td className="px-6 py-3">
                      {stu.class}
                    </td>

                    <td className="px-6 py-3">
                      {stu.roll}
                    </td>

                    <td className="px-6 py-3">
                      {stu.busId?.busNumber || "N/A"}
                    </td>

                    <td className="px-6 py-3 text-blue-600 font-semibold whitespace-nowrap">
                      {stu.studentCode}
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(stu)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(stu._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;