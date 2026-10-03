import { useEffect, useState } from "react";
import { api } from "../services/api";
import EnrollmentForm from "../components/EnrollmentForm";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsRes, studentsRes, coursesRes] =
          await Promise.all([
            api.getEnrollments(),
            api.getStudents(),
            api.getCourses(),
          ]);

        if (!enrollmentsRes.success) {
          throw new Error(
            enrollmentsRes.message ||
              "Failed to fetch enrollments"
          );
        }

        setEnrollments(enrollmentsRes.data);

        if (studentsRes.success) {
          setStudents(studentsRes.data);
        }

        if (coursesRes.success) {
          setCourses(coursesRes.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleCreateEnrollment = async (enrollmentData) => {
    try {
      const response = await api.createEnrollment(enrollmentData);

      if (!response.success) {
        return {
          success: false,
          message: response.message,
          errors: response.errors,
        };
      }

      setEnrollments((prev) => [response.data, ...prev]);
      setShowForm(false);

      return { success: true };
    } catch {
      return {
        success: false,
        message: "Unable to connect to the server",
      };
    }
  };


  const searchedEnrollments = enrollments.filter((enrollment) => {
    const searchValue = search.toLowerCase();

    const studentName = (
      enrollment.student?.name || ""
    ).toLowerCase();

    const studentEmail = (
      enrollment.student?.email || ""
    ).toLowerCase();

    return (
      studentName.includes(searchValue) ||
      studentEmail.includes(searchValue)
    );
  });


  const filteredEnrollments = searchedEnrollments.filter(
    (enrollment) =>
      courseFilter === "all" ||
      enrollment.course?._id === courseFilter
  );


  const sortedEnrollments = [...filteredEnrollments].sort(
    (a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.enrollmentDate) -
            new Date(b.enrollmentDate)
          );
        case "name-asc":
          return (a.student?.name || "").localeCompare(
            b.student?.name || ""
          );
        case "name-desc":
          return (b.student?.name || "").localeCompare(
            a.student?.name || ""
          );
        case "newest":
        default:
          return (
            new Date(b.enrollmentDate) -
            new Date(a.enrollmentDate)
          );
      }
    }
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Enrollments</h1>
          <p>Enroll students into courses and track details</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
          disabled={students.length === 0 || courses.length === 0}
        >
          + Enroll Student
        </button>
      </div>


      <div className="toolbar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by student name or email..."
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
          aria-label="Sort enrollments"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name-asc">Student A-Z</option>
          <option value="name-desc">Student Z-A</option>
        </select>
      </div>


      {error && <div className="error-message">{error}</div>}


      {loading ? (
        <div className="loading">Loading enrollments...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Duration</th>
                <th>Enrollment Date</th>
              </tr>
            </thead>

            <tbody>
              {sortedEnrollments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No enrollments found
                  </td>
                </tr>
              ) : (
                sortedEnrollments.map((enrollment) => (
                  <tr key={enrollment._id}>
                    <td>
                      {enrollment.student?.name ||
                        "Deleted student"}
                    </td>

                    <td>
                      {enrollment.student?.email || "-"}
                    </td>

                    <td>
                      {enrollment.course?.courseName ||
                        "Deleted course"}
                    </td>

                    <td>
                      {enrollment.course?.duration || "-"}
                    </td>

                    <td>
                      {new Date(
                        enrollment.enrollmentDate
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Enroll Student</h2>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <EnrollmentForm
              students={students}
              courses={courses}
              onSubmit={handleCreateEnrollment}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Enrollments;
