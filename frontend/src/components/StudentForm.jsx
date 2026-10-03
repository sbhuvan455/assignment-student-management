import { useState } from "react";

function StudentForm({ student, courses, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() =>
    student
      ? {
          name: student.name || "",
          email: student.email || "",
          phone: student.phone || "",
          course: "",
          dateOfJoining: student.dateOfJoining
            ? student.dateOfJoining.substring(0, 10)
            : "",
        }
      : {
          name: "",
          email: "",
          phone: "",
          course: "",
          dateOfJoining: "",
        }
  );

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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain 10 digits";
    }

    if (!student && !formData.course) {
      newErrors.course = "Course is required";
    }

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of joining is required";
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

        if (result.errors) {
          const serverErrors = {};

          result.errors.forEach((error) => {
            if (error.toLowerCase().includes("name")) {
              serverErrors.name = error;
            }

            if (error.toLowerCase().includes("email")) {
              serverErrors.email = error;
            }

            if (error.toLowerCase().includes("phone")) {
              serverErrors.phone = error;
            }

            if (
              error.toLowerCase().includes("joining")
            ) {
              serverErrors.dateOfJoining = error;
            }
          });

          setErrors((prev) => ({
            ...prev,
            ...serverErrors,
          }));
        }
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
        <div className="error-message">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter student name"
          value={formData.name}
          onChange={handleChange}
        />

        {errors.name && (
          <span className="field-error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="student@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        {errors.email && (
          <span className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>

        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="10 digit phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        {errors.phone && (
          <span className="field-error">
            {errors.phone}
          </span>
        )}
      </div>

      {!student && (
        <div className="form-group">
          <label htmlFor="course">Course</label>

          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
          >
            <option value="">Select a course</option>

            {(courses || []).map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>

          {errors.course && (
            <span className="field-error">
              {errors.course}
            </span>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="dateOfJoining">
          Date of Joining
        </label>

        <input
          id="dateOfJoining"
          name="dateOfJoining"
          type="date"
          value={formData.dateOfJoining}
          onChange={handleChange}
        />

        {errors.dateOfJoining && (
          <span className="field-error">
            {errors.dateOfJoining}
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
          {submitting
            ? "Saving..."
            : student
            ? "Update Student"
            : "Add Student"}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
