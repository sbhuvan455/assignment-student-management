import { useEffect, useState } from "react";
import { api } from "../services/api";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";

function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes, enrollmentsRes] =
          await Promise.all([
            api.getStudents(),
            api.getCourses(),
            api.getEnrollments(),
          ]);

        if (!studentsRes.success) {
          throw new Error(
            studentsRes.message || "Failed to fetch students"
          );
        }

        setStudents(studentsRes.data);

        if (coursesRes.success) {
          setCourses(coursesRes.data);
        }

        if (enrollmentsRes.success) {
          setEnrollments(enrollmentsRes.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleAddStudent = async (studentData) => {
    try {
      const { course, ...studentPayload } = studentData;

      const response = await api.createStudent(studentPayload);

      if (!response.success) {
        return {
          success: false,
          message: response.message,
          errors: response.errors,
        };
      }

      setStudents((prev) => [response.data, ...prev]);

      if (course) {
        try {
          const enrollmentRes = await api.createEnrollment({
            student: response.data._id,
            course,
          });

          if (enrollmentRes.success) {
            setEnrollments((prev) => [
              enrollmentRes.data,
              ...prev,
            ]);
          }
        } catch(e) {
          console.log(e);
        }
      }

      setShowForm(false);

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        message: "Unable to connect to the server",
      };
    }
  };

  const handleUpdateStudent = async (studentData) => {
    try {
      const { name, email, phone, dateOfJoining } = studentData;

      const response = await api.updateStudent(
        editingStudent._id,
        { name, email, phone, dateOfJoining }
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message,
          errors: response.errors,
        };
      }

      setStudents((prev) =>
        prev.map((student) =>
          student._id === editingStudent._id
            ? response.data
            : student
        )
      );

      setEditingStudent(null);
      setShowForm(false);

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        message: "Unable to connect to the server",
      };
    }
  };

  const handleDeleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.deleteStudent(id);

      if (!response.success) {
        alert(response.message);
        return;
      }

      setStudents((prev) =>
        prev.filter((student) => student._id !== id)
      );

      setEnrollments((prev) =>
        prev.filter(
          (enrollment) => enrollment.student?._id !== id
        )
      );
    } catch {
      alert("Unable to connect to the server");
    }
  };

  const enrolledStudentIds = new Set(
    enrollments
      .filter(
        (enrollment) => enrollment.course?._id === courseFilter
      )
      .map((enrollment) => enrollment.student?._id)
  );

  const filteredStudents = students.filter((student) => {
    const matchesCourse =
      courseFilter === "all" ||
      enrolledStudentIds.has(student._id);

    const searchValue = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(searchValue) ||
      student.email.toLowerCase().includes(searchValue) ||
      student.phone.includes(searchValue);

    return matchesCourse && matchesSearch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "oldest":
        return (
          new Date(a.dateOfJoining) - new Date(b.dateOfJoining)
        );
      case "newest":
      default:
        return (
          new Date(b.dateOfJoining) - new Date(a.dateOfJoining)
        );
    }
  });

  const openAddForm = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage all registered students</p>
        </div>

        <button className="primary-btn" onClick={openAddForm}>
          + Add Student
        </button>
      </div>

      <div className="toolbar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          aria-label="Filter by course"
        >
          <option value="all">All courses</option>

          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort students"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <StudentTable
          students={sortedStudents}
          onEdit={openEditForm}
          onDelete={handleDeleteStudent}
        />
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingStudent
                  ? "Edit Student"
                  : "Add Student"}
              </h2>

              <button
                className="close-btn"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <StudentForm
              student={editingStudent}
              courses={courses}
              onSubmit={
                editingStudent
                  ? handleUpdateStudent
                  : handleAddStudent
              }
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
