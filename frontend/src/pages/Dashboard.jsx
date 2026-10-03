import { useEffect, useState } from "react";
import { api } from "../services/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

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


  const courseCounts = courses.map((course) => ({
    _id: course._id,
    name: course.courseName,
    count: enrollments.filter(
      (enrollment) => enrollment.course?._id === course._id
    ).length,
  }));

  const maxCount = Math.max(
    1,
    ...courseCounts.map((course) => course.count)
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of students, courses and enrollments</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Total Students</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{courses.length}</div>
              <div className="stat-label">Total Courses</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {enrollments.length}
              </div>
              <div className="stat-label">Total Enrollments</div>
            </div>
          </div>


          <div className="card">
            <h2>Course-wise Enrollments</h2>

            {courseCounts.length === 0 ? (
              <p className="empty">
                No courses yet. Create a course to get started.
              </p>
            ) : (
              <div className="bar-list">
                {courseCounts.map((course) => (
                  <div className="bar-row" key={course._id}>
                    <span className="bar-label">
                      {course.name}
                    </span>

                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${
                            (course.count / maxCount) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <span className="bar-count">
                      {course.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
