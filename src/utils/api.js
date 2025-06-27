import axios from "axios";

const API_BASE_URL = "http://192.168.1.2:8080"; // API Gateway URL
// const API_BASE_URL = "http://localhost:8080"; // API Gateway URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

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
      let response;
      if (user.role == "STUDENT") {
        response = await api.get(`/api/courses/user/${user.userId}/enrolled`);
      } else if (user.role == "TEACHER") {
        console.log("Teachers information:", user);
        response = await api.get(`/api/courses/user/${user.userId}/assigned`);
      }
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
  fetchClassesCourseId: async (user, courseId) => {
    try{
      const response = await api.get(`/api/courses/user/${user.userId}/course/${courseId}/classrooms`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "An error occurred while fetching classes for course",
        }
      );
      
    }
  },
  featchClasses: async (user) => {
    try {
      let response;
      if (user.role == "STUDENT") {
        response = await api.get(`/api/courses/user/${user.userId}/${user.role.toLowerCase()}/classrooms`);
      } else if (user.role == "TEACHER") {
        response = await api.get(`/api/courses/user/${user.userId}/instructor/classrooms`);
      }
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "An error occurred while fetching classes",
        }
      );
    }
  },

  createClass: async (courseId, classData) => {
    try {
      const response = await api.post(`/api/courses/create/${courseId}/class`, classData);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error)
    }
  },
};

// New services for lab management features
export const chatService = {
  getChatHistory: async (classId) => {
    try {
      const response = await api.get(`/api/chat/${classId}/history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error fetching chat history" };
    }
  },

  sendMessage: async (classId, message) => {
    try {
      const response = await api.post(`/api/chat/${classId}/message`, message);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error sending message" };
    }
  }
};

export const screenShareService = {
  requestScreenShare: async (classId, studentId) => {
    try {
      const response = await api.post(`/api/screenshare/${classId}/request`, {
        studentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error requesting screen share" };
    }
  },

  approveScreenShare: async (requestId, studentId) => {
    try {
      const response = await api.post(`/api/screenshare/approve`, {
        requestId,
        studentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error approving screen share" };
    }
  },

  denyScreenShare: async (requestId, studentId) => {
    try {
      const response = await api.post(`/api/screenshare/deny`, {
        requestId,
        studentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error denying screen share" };
    }
  },

  startScreenShare: async (classId, studentId, stream) => {
    try {
      // This would integrate with WebRTC signaling
      const response = await api.post(`/api/screenshare/${classId}/start`, {
        studentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error starting screen share" };
    }
  },

  stopScreenShare: async (classId, studentId) => {
    try {
      const response = await api.post(`/api/screenshare/${classId}/stop`, {
        studentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error stopping screen share" };
    }
  },

  takeControl: async (classId, studentId) => {
    try {
      const response = await api.post(`/api/screenshare/${classId}/control`, {
        studentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error taking control" };
    }
  }
};

export const labSessionService = {
  getSessionData: async (classId) => {
    try {
      const response = await api.get(`/api/lab-session/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error fetching session data" };
    }
  },

  startSession: async (classId) => {
    try {
      const response = await api.post(`/api/lab-session/${classId}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error starting session" };
    }
  },

  endSession: async (classId) => {
    try {
      const response = await api.post(`/api/lab-session/${classId}/end`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error ending session" };
    }
  },

  kickParticipant: async (classId, participantId) => {
    try {
      const response = await api.post(`/api/lab-session/${classId}/kick`, {
        participantId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error kicking participant" };
    }
  }
};

// Admin-specific services
export const adminService = {
  getUsers: async (page = 0, size = 20) => {
    try {
      const response = await api.get(`/api/admin/users?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error fetching users" };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/api/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error creating user" };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error updating user" };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error deleting user" };
    }
  },

  assignUserToClass: async (userId, classId) => {
    try {
      const response = await api.post(`/api/admin/assign`, {
        userId,
        classId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error assigning user to class" };
    }
  },

  getAuditLogs: async (page = 0, size = 20) => {
    try {
      const response = await api.get(`/api/admin/audit-logs?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error fetching audit logs" };
    }
  }
};

export default api;