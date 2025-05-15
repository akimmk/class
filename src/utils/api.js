import axios from 'axios';

const API_BASE_URL = 'http://10.139.27.89:8080'; // API Gateway URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(response);
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },
};

export const courseService = {
  fetchCourses: async () => {
    try {
      const response = await api.get("/api/courses");
      console.log(response);
      return response.data.content;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching courses' };
    }
  },
};

export default api;