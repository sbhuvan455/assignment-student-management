import { useState } from "react";

function CourseForm({ course, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() =>
    course
      ? {
          courseName: course.courseName || "",
          duration: course.duration || "",
        }
      : {
          courseName: "",
          duration: "",
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

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
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
        <label htmlFor="courseName">Course Name</label>

        <input
          id="courseName"
          name="courseName"
          type="text"
          placeholder="Enter course name"
          value={formData.courseName}
          onChange={handleChange}
        />

        {errors.courseName && (
          <span className="field-error">{errors.courseName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration</label>

        <input
          id="duration"
          name="duration"
          type="text"
          placeholder="e.g. 6 months"
          value={formData.duration}
          onChange={handleChange}
        />

        {errors.duration && (
          <span className="field-error">{errors.duration}</span>
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
          {submitting ? "Saving..." : course ? "Update Course" : "Add Course"}
        </button>
      </div>
    </form>
  );
}

export default CourseForm;
