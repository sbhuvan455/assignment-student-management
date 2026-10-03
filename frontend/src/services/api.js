const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = {
  getStudents: async () => {
    const response = await fetch(`${API_URL}/students`);
    return response.json();
  },

  getStudent: async (id) => {
    const response = await fetch(`${API_URL}/students/${id}`);
    return response.json();
  },

  createStudent: async (student) => {
    const response = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    return response.json();
  },

  updateStudent: async (id, student) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    return response.json();
  },

  deleteStudent: async (id) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: "DELETE",
    });

    return response.json();
  },

  getCourses: async () => {
    const response = await fetch(`${API_URL}/courses`);
    return response.json();
  },

  createCourse: async (course) => {
    const response = await fetch(`${API_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    });

    return response.json();
  },

  getEnrollments: async () => {
    const response = await fetch(`${API_URL}/enrollments`);
    return response.json();
  },

  createEnrollment: async (enrollment) => {
    const response = await fetch(`${API_URL}/enrollments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollment),
    });

    return response.json();
  },
};