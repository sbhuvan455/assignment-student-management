import { useEffect, useState } from "react";
import { api } from "../services/api";
import CourseForm from "../components/CourseForm";
import CourseTable from "../components/CourseTable";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getCourses();

        if (!response.success) {
          throw new Error(
            response.message || "Failed to fetch courses"
          );
        }

        setCourses(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Add course
  const handleAddCourse = async (courseData) => {
    try {
      const response = await api.createCourse(courseData);

      if (!response.success) {
        return {
          success: false,
          message: response.message,
          errors: response.errors,
        };
      }

      setCourses((prev) => [response.data, ...prev]);
      setShowForm(false);

      return { success: true };
    } catch {
      return {
        success: false,
        message: "Unable to connect to the server",
      };
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case "name-desc":
        return b.courseName.localeCompare(a.courseName);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p>Create and manage all courses</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(true)}>
          + Add Course
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-spacer" />

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort courses"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name-asc">Course name A-Z</option>
          <option value="name-desc">Course name Z-A</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <CourseTable courses={sortedCourses} />
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Course</h2>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <CourseForm
              onSubmit={handleAddCourse}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
