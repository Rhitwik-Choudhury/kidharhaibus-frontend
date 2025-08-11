import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { studentsAPI } from "../../services/api";

const Students = () => {
  const { user } = useAuth(); // Get current logged-in school user from context

  // Student form state
  const [formData, setFormData] = useState({
    name: "",
    studentClass: "",  // Will be sent as "class"
    rollNumber: "",    // Will be sent as "roll"
    address: "",
    bus: "",
    code: "",          // Will be sent as "studentCode"
  });

  const [students, setStudents] = useState([]); // Students list
  const [editingId, setEditingId] = useState(null); // Track if we're editing

  // Fetch existing students on mount
  useEffect(() => {
    console.log("School ID used to fetch students:", user.id);
    const fetchStudents = async () => {
      try {
        const res = await studentsAPI.getStudents();
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate unique student code based on school name + student name + class
  const generateStudentCode = () => {
    const { name, studentClass } = formData;
    const schoolName = user?.schoolName || "";

    if (!schoolName || !name || !studentClass) {
      alert("Enter school name, student name, and class first.");
      return;
    }

    const schoolCode = schoolName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 3);
    const [firstName = "", lastName = ""] = name.trim().split(" ");
    const firstCode = firstName.slice(0, 3).toUpperCase();
    const lastCode = lastName.slice(0, 3).toUpperCase();
    const classCode = String(studentClass).padStart(2, "0");

    const code = `${schoolCode}-${firstCode}-${lastCode}-${classCode}`;
    setFormData((prev) => ({ ...prev, code }));
  };

  // Handle submit to create or update a student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      class: formData.studentClass,
      roll: formData.rollNumber,
      address: formData.address,
      bus: formData.bus,
      studentCode: formData.code,
      schoolId: user.id,
    };

    try {
      if (editingId) {
        // Update existing student
        const res = await studentsAPI.updateStudent(editingId, payload);
        setStudents((prev) =>
          prev.map((stu) => (stu._id === editingId ? res.data : stu))
        );
        setEditingId(null);
      } else {
        // Create new student
        const res = await studentsAPI.createStudent(payload);
        setStudents((prev) => [...prev, res.data]);
      }

      // Reset form
      setFormData({
        name: "",
        studentClass: "",
        rollNumber: "",
        address: "",
        bus: "",
        code: "",
      });
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  // Populate form fields for editing
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      studentClass: student.class,
      rollNumber: student.roll,
      address: student.address,
      bus: student.bus,
      code: student.studentCode,
    });
    setEditingId(student._id);
  };

  // Delete student by ID
  const handleDelete = async (id) => {
    try {
      await studentsAPI.deleteStudent(id);
      setStudents((prev) => prev.filter((stu) => stu._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {editingId ? "Edit Student" : "Add New Student"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-4"
      >
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="text" name="studentClass" placeholder="Class" value={formData.studentClass} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="number" name="rollNumber" placeholder="Roll Number" value={formData.rollNumber} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="text" name="bus" placeholder="Assign Bus" value={formData.bus} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>

        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border p-2 rounded w-full" required />

        <div className="flex gap-2">
          <input type="text" name="code" placeholder="Student Code" value={formData.code} onChange={handleChange} className="border p-2 rounded w-full" />
          <button type="button" onClick={generateStudentCode} className="bg-gray-300 px-4 rounded hover:bg-gray-400">
            Generate Student Code
          </button>
        </div>

        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {editingId ? "Update Student" : "Add Student"}
        </motion.button>
      </form>

      {/* List */}
      {students.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Student List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Class</th>
                  <th className="px-4 py-2">Roll</th>
                  <th className="px-4 py-2">Bus</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{stu.name}</td>
                    <td className="px-4 py-2">{stu.class}</td>
                    <td className="px-4 py-2">{stu.roll}</td>
                    <td className="px-4 py-2">{stu.bus}</td>
                    <td className="px-4 py-2 font-mono">{stu.studentCode}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(stu)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(stu._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
