import axios from "axios";

// const API_BASE_URL = "http://10.139.27.89:8080"; // API Gateway URL
const API_BASE_URL = "http://localhost:8080"; // API Gateway URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(response);
      throw (
        error.response?.data || { message: "An error occurred during login" }
      );
    }
  },
};

export const courseService = {
  fetchCourses: async (user) => {
    try {
      const response = await api.get(
        `/api/courses/user/${user.userId}/enrolled`,
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "An error occurred while fetching courses",
        }
      );
    }
  },
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "An error occurred while fetching course by id",
        }
      );
    }
  },
};

export const classService = {
  fetchClasses: async (user, courseId) => {
    api
      .get("/api/classes")
      .then((response) => {
        console.log("Fetch Classes Response:", response);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  },
  createClass: async (classData) => {
    api
      .post("/api/classes", classData)
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .catch((error) => {
        console.error("Error creating class:", error);
      });
  },
};

export default api;
