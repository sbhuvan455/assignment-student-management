function StudentTable({ students, onEdit, onDelete }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Joining</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty">
                No students found
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>

                <td>{student.email}</td>

                <td>{student.phone}</td>

                <td>
                  {new Date(
                    student.dateOfJoining
                  ).toLocaleDateString()}
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(student._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
