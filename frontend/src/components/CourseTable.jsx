function CourseTable({ courses }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Duration</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="2" className="empty">
                No courses found
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course._id}>
                <td>{course.courseName}</td>

                <td>{course.duration}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseTable;
