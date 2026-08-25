import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { studentsAPI, busesAPI } from "../../services/api";

const Students = () => {
  const { user } = useAuth();

  const formSectionRef = useRef(null);

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

  // Search / filter / sort
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [busFilter, setBusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    try {
      const schoolId = user?._id || user?.id;

      if (!schoolId) return;

      const res = await studentsAPI.getStudents({
        schoolId,
      });

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

      const res = await busesAPI.getBuses({
        schoolId,
      });

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
    // Student codes cannot be regenerated during editing.
    if (editingId) return;

    const { name, studentClass } = formData;
    const schoolName = user?.schoolName || "";

    if (!schoolName || !name || !studentClass) {
      alert(
        "Enter school name, student name, and class first."
      );
      return;
    }

    const schoolCode = schoolName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);

    const nameParts = name.trim().split(/\s+/);

    const firstName = nameParts[0] || "";
    const lastName =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1]
        : "";

    const firstCode = firstName
      .slice(0, 3)
      .toUpperCase();

    const lastCode = lastName
      .slice(0, 3)
      .toUpperCase();

    const classCode = String(
      studentClass
    ).padStart(2, "0");

    const code =
      `${schoolCode}${firstCode}${lastCode}${classCode}`;

    setFormData((prev) => ({
      ...prev,
      code,
    }));
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      studentClass: "",
      rollNumber: "",
      address: "",
      busId: "",
      code: "",
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const schoolId = user?._id || user?.id;

    if (!schoolId) {
      alert(
        "School information is unavailable. Please log in again."
      );
      return;
    }

    try {
      if (editingId) {
        /*
         * IMPORTANT:
         * studentCode is deliberately NOT included here.
         *
         * Once a student has been created, their code should
         * remain permanent because parents may be linked to it.
         */
        const updatePayload = {
          name: formData.name,
          class: formData.studentClass,
          roll: formData.rollNumber,
          address: formData.address,
          busId: formData.busId,
        };

        await studentsAPI.updateStudent(
          editingId,
          updatePayload
        );
      } else {
        const createPayload = {
          name: formData.name,
          class: formData.studentClass,
          roll: formData.rollNumber,
          address: formData.address,
          busId: formData.busId,
          studentCode: formData.code,
          schoolId,
        };

        await studentsAPI.createStudent(
          createPayload
        );
      }

      await fetchStudents();

      resetForm();
    } catch (err) {
      console.error(
        "Error saving student:",
        err
      );
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

    // Scroll directly to the form instead of relying on window scrolling.
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
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

      // If the deleted student happened to be in edit mode.
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );
    }
  };

  // ================= UNIQUE CLASSES =================
  const availableClasses = useMemo(() => {
    const classes = [
      ...new Set(
        students
          .map((student) =>
            String(student.class || "").trim()
          )
          .filter(Boolean)
      ),
    ];

    return classes.sort((a, b) => {
      const numberA = Number(a);
      const numberB = Number(b);

      if (
        !Number.isNaN(numberA) &&
        !Number.isNaN(numberB)
      ) {
        return numberA - numberB;
      }

      return a.localeCompare(b, undefined, {
        numeric: true,
      });
    });
  }, [students]);

  // ================= FILTER / SEARCH / SORT =================
  const filteredStudents = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    let result = students.filter(
      (student) => {
        const matchesSearch =
          !query ||
          student.name
            ?.toLowerCase()
            .includes(query) ||
          String(student.roll || "")
            .toLowerCase()
            .includes(query) ||
          student.studentCode
            ?.toLowerCase()
            .includes(query) ||
          String(student.class || "")
            .toLowerCase()
            .includes(query) ||
          student.busId?.busNumber
            ?.toLowerCase()
            .includes(query);

        const matchesClass =
          !classFilter ||
          String(student.class) ===
            classFilter;

        const matchesBus =
          !busFilter ||
          String(student.busId?._id || "") ===
            busFilter;

        return (
          matchesSearch &&
          matchesClass &&
          matchesBus
        );
      }
    );

    result = [...result].sort(
      (a, b) => {
        switch (sortBy) {
          case "name-desc":
            return (b.name || "").localeCompare(
              a.name || "",
              undefined,
              {
                sensitivity: "base",
              }
            );

          case "class-asc":
            return String(
              a.class || ""
            ).localeCompare(
              String(b.class || ""),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              }
            );

          case "class-desc":
            return String(
              b.class || ""
            ).localeCompare(
              String(a.class || ""),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              }
            );

          case "roll-asc":
            return String(
              a.roll || ""
            ).localeCompare(
              String(b.roll || ""),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              }
            );

          case "roll-desc":
            return String(
              b.roll || ""
            ).localeCompare(
              String(a.roll || ""),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              }
            );

          case "bus-asc":
            return String(
              a.busId?.busNumber || ""
            ).localeCompare(
              String(
                b.busId?.busNumber || ""
              ),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              }
            );

          case "bus-desc":
            return String(
              b.busId?.busNumber || ""
            ).localeCompare(
              String(
                a.busId?.busNumber || ""
              ),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              }
            );

          case "name-asc":
          default:
            return (a.name || "").localeCompare(
              b.name || "",
              undefined,
              {
                sensitivity: "base",
              }
            );
        }
      }
    );

    return result;
  }, [
    students,
    searchTerm,
    classFilter,
    busFilter,
    sortBy,
  ]);

  const filtersActive =
    searchTerm ||
    classFilter ||
    busFilter ||
    sortBy !== "name-asc";

  const clearFilters = () => {
    setSearchTerm("");
    setClassFilter("");
    setBusFilter("");
    setSortBy("name-asc");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ================= STUDENT FORM ================= */}
      <div
        ref={formSectionRef}
        className="scroll-mt-6"
      >
        <h1 className="text-2xl font-semibold mb-6">
          {editingId
            ? "Edit Student"
            : "Add New Student"}
        </h1>

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
              <option value="">
                Select Bus
              </option>

              {buses.map((bus) => (
                <option
                  key={bus._id}
                  value={bus._id}
                >
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

          {/* ================= STUDENT CODE ================= */}
          <div>
            {editingId && (
              <p className="text-xs font-medium text-gray-500 mb-1.5">
                Student Code
              </p>
            )}

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

              {!editingId && (
                <button
                  type="button"
                  onClick={
                    generateStudentCode
                  }
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 whitespace-nowrap"
                >
                  Generate Code
                </button>
              )}
            </div>

            {editingId && (
              <p className="text-xs text-gray-500 mt-1.5">
                Student code cannot be
                changed after the student
                has been created.
              </p>
            )}
          </div>

          {/* ================= FORM ACTIONS ================= */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              type="submit"
              whileTap={{
                scale: 0.98,
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {editingId
                ? "Update Student"
                : "Add Student"}
            </motion.button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= STUDENT MANAGEMENT ================= */}
      <div className="mt-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Students
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {students.length}{" "}
              {students.length === 1
                ? "student"
                : "students"}{" "}
              registered
            </p>
          </div>
        </div>

        {students.length > 0 && (
          <>
            {/* ================= SEARCH ================= */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search by name, roll number, class, bus or student code..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ================= FILTERS ================= */}
            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter
                  size={18}
                  className="text-gray-500"
                />

                <span className="text-sm font-semibold text-gray-700">
                  Filter & Sort
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Class */}
                <select
                  value={classFilter}
                  onChange={(e) =>
                    setClassFilter(
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    All Classes
                  </option>

                  {availableClasses.map(
                    (studentClass) => (
                      <option
                        key={
                          studentClass
                        }
                        value={
                          studentClass
                        }
                      >
                        Class{" "}
                        {studentClass}
                      </option>
                    )
                  )}
                </select>

                {/* Bus */}
                <select
                  value={busFilter}
                  onChange={(e) =>
                    setBusFilter(
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    All Buses
                  </option>

                  {buses.map((bus) => (
                    <option
                      key={bus._id}
                      value={bus._id}
                    >
                      {bus.busNumber}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <div className="relative">
                  <ArrowUpDown
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="name-asc">
                      Name: A → Z
                    </option>

                    <option value="name-desc">
                      Name: Z → A
                    </option>

                    <option value="class-asc">
                      Class: Low → High
                    </option>

                    <option value="class-desc">
                      Class: High → Low
                    </option>

                    <option value="roll-asc">
                      Roll: Low → High
                    </option>

                    <option value="roll-desc">
                      Roll: High → Low
                    </option>

                    <option value="bus-asc">
                      Bus: Low → High
                    </option>

                    <option value="bus-desc">
                      Bus: High → Low
                    </option>
                  </select>
                </div>

                {/* Clear */}
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={
                    !filtersActive
                  }
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Result count */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {
                    filteredStudents.length
                  }
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {students.length}
                </span>{" "}
                students
              </p>

              {(searchTerm ||
                classFilter ||
                busFilter) && (
                <p className="text-xs text-blue-600">
                  Filters applied
                </p>
              )}
            </div>
          </>
        )}

        {/* ================= EMPTY STATE ================= */}
        {students.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="font-medium text-gray-600">
              No students added yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Students you add will
              appear here.
            </p>
          </div>
        ) : filteredStudents.length ===
          0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <Search
              className="mx-auto mb-3 text-gray-400"
              size={28}
            />

            <p className="font-medium text-gray-600">
              No students found
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Try changing your search
              or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* ================= TABLE ================= */
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full min-w-[850px] border-collapse bg-white">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  <th className="px-6 py-3">
                    Name
                  </th>

                  <th className="px-6 py-3">
                    Class
                  </th>

                  <th className="px-6 py-3">
                    Roll
                  </th>

                  <th className="px-6 py-3">
                    Bus
                  </th>

                  <th className="px-6 py-3">
                    Student Code
                  </th>

                  <th className="px-6 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map(
                  (student) => (
                    <tr
                      key={student._id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {student.name}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {
                          student.class
                        }
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {student.roll}
                      </td>

                      <td className="px-6 py-3">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {student
                            .busId
                            ?.busNumber ||
                            "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-blue-600 font-semibold whitespace-nowrap">
                        {
                          student.studentCode
                        }
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                student
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                student._id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;