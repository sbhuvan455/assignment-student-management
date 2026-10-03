import { useState } from "react";

function EnrollmentForm({ students, courses, onSubmit, onCancel }) {
  const today = new Date().toISOString().substring(0, 10);

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    enrollmentDate: today,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.student) {
      newErrors.student = "Student is required";
    }

    if (!formData.course) {
      newErrors.course = "Course is required";
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const result = await onSubmit(formData);

      if (!result.success) {
        setServerError(result.message || "Something went wrong");
      }
    } catch {
      setServerError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      {serverError && (
        <div className="error-message">{serverError}</div>
      )}

      <div className="form-group">
        <label htmlFor="student">Student</label>

        <select
          id="student"
          name="student"
          value={formData.student}
          onChange={handleChange}
        >
          <option value="">Select a student</option>

          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>

        {errors.student && (
          <span className="field-error">{errors.student}</span>
        )}
      </div>


      <div className="form-group">
        <label htmlFor="course">Course</label>

        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
        >
          <option value="">Select a course</option>

          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>

        {errors.course && (
          <span className="field-error">{errors.course}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="enrollmentDate">Enrollment Date</label>

        <input
          id="enrollmentDate"
          name="enrollmentDate"
          type="date"
          value={formData.enrollmentDate}
          onChange={handleChange}
        />

        {errors.enrollmentDate && (
          <span className="field-error">
            {errors.enrollmentDate}
          </span>
        )}
      </div>


      <div className="form-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-btn"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Enroll Student"}
        </button>
      </div>
    </form>
  );
}

export default EnrollmentForm;
