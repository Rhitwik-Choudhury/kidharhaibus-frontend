import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  Plus,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { studentsAPI, busesAPI } from "../../services/api";

const Students = () => {
  const { user } = useAuth();

  const formSectionRef = useRef(null);

  // =========================================================
  // Main data
  // =========================================================
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);

  // =========================================================
  // Form
  // =========================================================
  const [formData, setFormData] = useState({
    name: "",
    studentClass: "",
    rollNumber: "",
    address: "",
    busId: "",
    code: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // =========================================================
  // Copy feedback
  // =========================================================
  const [copiedCode, setCopiedCode] = useState("");

  // =========================================================
  // Search / filter / sort
  // =========================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [busFilter, setBusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  // =========================================================
  // Pagination
  // =========================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // =========================================================
  // Fetch students
  // =========================================================
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

  // =========================================================
  // Fetch buses
  // =========================================================
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

  // =========================================================
  // Handle form input
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Generate student code
  // =========================================================
  const generateStudentCode = () => {
    // Existing student codes must never be regenerated.
    if (editingId) return;

    const { name, studentClass } = formData;
    const schoolName = user?.schoolName || "";

    if (!schoolName || !name || !studentClass) {
      alert(
        "Enter the student name and class before generating the student code."
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

  // =========================================================
  // Copy student code
  // =========================================================
  const handleCopyCode = async (code) => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 1800);
    } catch (error) {
      console.error(
        "Failed to copy student code:",
        error
      );

      alert(
        "Could not copy the student code."
      );
    }
  };

  // =========================================================
  // Reset form
  // =========================================================
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

  // =========================================================
  // Close form
  // =========================================================
  const closeForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  // =========================================================
  // Open Add Student form
  // =========================================================
  const handleOpenAddStudent = () => {
    resetForm();

    setIsFormOpen(true);

    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // =========================================================
  // Submit student
  // =========================================================
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
         *
         * studentCode is intentionally NOT included
         * in the update payload.
         *
         * Student codes are permanent identifiers
         * because parent accounts may already be
         * linked using this code.
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
        if (!formData.code) {
          alert(
            "Please generate a student code before adding the student."
          );
          return;
        }

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

      // Close form after successful Add / Update.
      setIsFormOpen(false);
    } catch (err) {
      console.error(
        "Error saving student:",
        err
      );
    }
  };

  // =========================================================
  // Edit student
  // =========================================================
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

    // Make sure the form is open.
    setIsFormOpen(true);

    // Wait until React renders the form.
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  // =========================================================
  // Delete student
  // =========================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await studentsAPI.deleteStudent(id);

      await fetchStudents();

      if (editingId === id) {
        closeForm();
      }
    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );
    }
  };

  // =========================================================
  // Unique classes
  // =========================================================
  const availableClasses = useMemo(() => {
    const classes = [
      ...new Set(
        students
          .map((student) =>
            String(
              student.class || ""
            ).trim()
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

      return a.localeCompare(
        b,
        undefined,
        {
          numeric: true,
        }
      );
    });
  }, [students]);

  // =========================================================
  // Search / filter / sort
  // =========================================================
  const filteredStudents = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    let result = students.filter(
      (student) => {
        const busNumber =
          student.busId?.busNumber || "";

        const matchesSearch =
          !query ||
          student.name
            ?.toLowerCase()
            .includes(query) ||
          String(
            student.roll || ""
          )
            .toLowerCase()
            .includes(query) ||
          student.studentCode
            ?.toLowerCase()
            .includes(query) ||
          String(
            student.class || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(busNumber)
            .toLowerCase()
            .includes(query);

        const matchesClass =
          !classFilter ||
          String(student.class) ===
            classFilter;

        const matchesBus =
          !busFilter ||
          String(
            student.busId?._id || ""
          ) === busFilter;

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
            return (
              b.name || ""
            ).localeCompare(
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
              String(
                b.class || ""
              ),
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
              String(
                a.class || ""
              ),
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
              String(
                b.roll || ""
              ),
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
              String(
                a.roll || ""
              ),
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
            return (
              a.name || ""
            ).localeCompare(
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

  // =========================================================
  // Reset pagination when filters change
  // =========================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    classFilter,
    busFilter,
    sortBy,
    pageSize,
  ]);

  // =========================================================
  // Pagination
  // =========================================================
  const totalFilteredStudents =
    filteredStudents.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalFilteredStudents / pageSize
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * pageSize;

  const endIndex =
    startIndex + pageSize;

  const paginatedStudents =
    filteredStudents.slice(
      startIndex,
      endIndex
    );

  const firstVisibleStudent =
    totalFilteredStudents === 0
      ? 0
      : startIndex + 1;

  const lastVisibleStudent = Math.min(
    endIndex,
    totalFilteredStudents
  );

  // =========================================================
  // Page numbers
  // =========================================================
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        "...",
        totalPages,
      ];
    }

    if (
      currentPage >=
      totalPages - 3
    ) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // =========================================================
  // Filters
  // =========================================================
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
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Students
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            Manage students registered
            with your school.
          </p>
        </div>

        <button
          type="button"
          onClick={
            isFormOpen && !editingId
              ? closeForm
              : handleOpenAddStudent
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {isFormOpen &&
          !editingId ? (
            <>
              <ChevronUp
                size={18}
              />

              Close Form
            </>
          ) : (
            <>
              <Plus size={18} />

              Add Student
            </>
          )}
        </button>
      </div>

      {/* =====================================================
          COLLAPSIBLE STUDENT FORM
      ====================================================== */}
      {isFormOpen && (
        <motion.div
          ref={formSectionRef}
          className="scroll-mt-6 mb-8"
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            {/* ================= FORM HEADER ================= */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <UserPlus
                      size={21}
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingId
                        ? "Edit Student Details"
                        : "Add New Student"}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-gray-600">
                      {editingId
                        ? "Update the student's information below. The student code will remain unchanged."
                        : "Enter the student's details below to register them with your school."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-gray-800 hover:shadow-sm"
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form
              className="p-6"
              onSubmit={handleSubmit}
            >
              {/* ================= STUDENT INFORMATION ================= */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Student Information
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Basic academic and
                    transport information
                    for this student.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="student-name"
                      className="mb-1.5 block text-sm font-semibold text-gray-800"
                    >
                      Student Name

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="student-name"
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label
                      htmlFor="student-class"
                      className="mb-1.5 block text-sm font-semibold text-gray-800"
                    >
                      Class

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="student-class"
                      type="text"
                      name="studentClass"
                      placeholder="e.g. 06"
                      value={
                        formData.studentClass
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label
                      htmlFor="student-roll"
                      className="mb-1.5 block text-sm font-semibold text-gray-800"
                    >
                      Roll Number

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="student-roll"
                      type="number"
                      name="rollNumber"
                      placeholder="e.g. 24"
                      value={
                        formData.rollNumber
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>

                  {/* Bus */}
                  <div>
                    <label
                      htmlFor="student-bus"
                      className="mb-1.5 block text-sm font-semibold text-gray-800"
                    >
                      Assigned Bus

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      id="student-bus"
                      name="busId"
                      value={
                        formData.busId
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    >
                      <option value="">
                        Select a bus
                      </option>

                      {buses.map(
                        (bus) => (
                          <option
                            key={
                              bus._id
                            }
                            value={
                              bus._id
                            }
                          >
                            {
                              bus.busNumber
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-5">
                  <label
                    htmlFor="student-address"
                    className="mb-1.5 block text-sm font-semibold text-gray-800"
                  >
                    Address

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    id="student-address"
                    name="address"
                    placeholder="Enter the student's residential address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    rows={3}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* ================= DIVIDER ================= */}
              <div className="my-6 border-t border-gray-200" />

              {/* ================= STUDENT CODE ================= */}
              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Student Identification
                  </h3>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <label
                    htmlFor="student-code"
                    className="mb-1.5 block text-sm font-semibold text-gray-800"
                  >
                    Student Code
                  </label>

                  <p className="mb-3 text-xs leading-5 text-gray-600">
                    {editingId
                      ? "This permanent code identifies the student and may already be linked with a parent account. It cannot be changed."
                      : "Generate the unique student code after entering the student's name and class."}
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="student-code"
                      type="text"
                      name="code"
                      placeholder="Student code will appear here"
                      value={
                        formData.code
                      }
                      readOnly
                      required
                      className="w-full rounded-lg border border-blue-200 bg-white px-3.5 py-2.5 font-mono text-sm font-bold tracking-wide text-blue-800 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-500 outline-none"
                    />

                    {!editingId && (
                      <button
                        type="button"
                        onClick={
                          generateStudentCode
                        }
                        className="whitespace-nowrap rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
                      >
                        Generate Code
                      </button>
                    )}

                    {formData.code && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            formData.code
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        {copiedCode ===
                        formData.code ? (
                          <>
                            <Check
                              size={17}
                            />

                            Copied
                          </>
                        ) : (
                          <>
                            <Copy
                              size={17}
                            />

                            Copy Code
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {editingId && (
                    <div className="mt-3 rounded-lg border border-blue-100 bg-white/70 px-3 py-2">
                      <p className="text-xs font-medium text-blue-700">
                        This code is
                        locked and will
                        remain unchanged
                        when the student
                        details are
                        updated.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= FORM ACTIONS ================= */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-5">
                <motion.button
                  type="submit"
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {editingId
                    ? "Update Student"
                    : "Add Student"}
                </motion.button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                {editingId && (
                  <span className="text-xs text-gray-500">
                    Updating the
                    student will not
                    change their
                    Student Code.
                  </span>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* =====================================================
          STUDENT MANAGEMENT
      ====================================================== */}
      <div>
        {/* Student count */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Student Directory
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {students.length}{" "}
            {students.length === 1
              ? "student"
              : "students"}{" "}
            registered
          </p>
        </div>

        {students.length > 0 && (
          <>
            {/* =================================================
                SEARCH
            ================================================== */}
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
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* =================================================
                FILTERS
            ================================================== */}
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
                  className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-sm font-medium text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-sm font-medium text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    All Buses
                  </option>

                  {buses.map(
                    (bus) => (
                      <option
                        key={bus._id}
                        value={bus._id}
                      >
                        {bus.busNumber}
                      </option>
                    )
                  )}
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
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 bg-white text-sm font-medium text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  onClick={
                    clearFilters
                  }
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

            {/* =================================================
                RESULTS / PAGE SIZE
            ================================================== */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">
                  {totalFilteredStudents >
                  0 ? (
                    <>
                      Showing{" "}

                      <span className="font-medium text-gray-700">
                        {
                          firstVisibleStudent
                        }
                      </span>

                      –

                      <span className="font-medium text-gray-700">
                        {
                          lastVisibleStudent
                        }
                      </span>{" "}

                      of{" "}

                      <span className="font-medium text-gray-700">
                        {
                          totalFilteredStudents
                        }
                      </span>{" "}

                      students
                    </>
                  ) : (
                    "No matching students"
                  )}
                </p>

                {totalFilteredStudents !==
                  students.length && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {
                      students.length
                    }{" "}
                    total students
                    registered
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="pageSize"
                  className="text-sm text-gray-500"
                >
                  Rows per page:
                </label>

                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) =>
                    setPageSize(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-blue-500"
                >
                  <option
                    value={25}
                  >
                    25
                  </option>

                  <option
                    value={50}
                  >
                    50
                  </option>

                  <option
                    value={100}
                  >
                    100
                  </option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* =====================================================
            EMPTY STATES
        ====================================================== */}
        {students.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="font-medium text-gray-700">
              No students added yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Add your first student
              to start building the
              school directory.
            </p>

            <button
              type="button"
              onClick={
                handleOpenAddStudent
              }
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus size={16} />

              Add Student
            </button>
          </div>
        ) : filteredStudents.length ===
          0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <Search
              className="mx-auto mb-3 text-gray-400"
              size={28}
            />

            <p className="font-medium text-gray-600">
              No students found
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Try changing your
              search or filters.
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
          <>
            {/* =================================================
                TABLE
            ================================================== */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full min-w-[900px] border-collapse bg-white">
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
                  {paginatedStudents.map(
                    (student) => (
                      <tr
                        key={
                          student._id
                        }
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {
                            student.name
                          }
                        </td>

                        <td className="px-6 py-3 text-gray-600">
                          {
                            student.class
                          }
                        </td>

                        <td className="px-6 py-3 text-gray-600">
                          {
                            student.roll
                          }
                        </td>

                        <td className="px-6 py-3">
                          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {student
                              .busId
                              ?.busNumber ||
                              "N/A"}
                          </span>
                        </td>

                        {/* Student Code + Copy */}
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="font-mono text-sm font-semibold text-blue-700">
                              {
                                student.studentCode
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleCopyCode(
                                  student.studentCode
                                )
                              }
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                              title="Copy student code"
                              aria-label={`Copy student code ${student.studentCode}`}
                            >
                              {copiedCode ===
                              student.studentCode ? (
                                <Check
                                  size={
                                    15
                                  }
                                  className="text-green-600"
                                />
                              ) : (
                                <Copy
                                  size={
                                    15
                                  }
                                />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
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

            {/* =================================================
                PAGINATION
            ================================================== */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-5">
                <p className="text-sm text-gray-500">
                  Page{" "}

                  <span className="font-medium text-gray-700">
                    {currentPage}
                  </span>{" "}

                  of{" "}

                  <span className="font-medium text-gray-700">
                    {totalPages}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-1">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        (prev) =>
                          Math.max(
                            1,
                            prev - 1
                          )
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft
                      size={16}
                    />

                    <span className="hidden sm:inline">
                      Previous
                    </span>
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map(
                    (
                      page,
                      index
                    ) =>
                      page ===
                      "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={
                            page
                          }
                          type="button"
                          onClick={() =>
                            setCurrentPage(
                              page
                            )
                          }
                          className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition ${
                            currentPage ===
                            page
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                  )}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        (prev) =>
                          Math.min(
                            totalPages,
                            prev + 1
                          )
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <ChevronRight
                      size={16}
                    />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Students;