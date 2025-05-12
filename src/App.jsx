import React, { useMemo } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Course from "./pages/Course.jsx";
import Classes from "./pages/Classes.jsx";
import Streaming from "./pages/Streaming.jsx";
import Consumer from "./pages/Consumer.jsx";
import Login from "./pages/Login.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import "./index.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isTeacher, isStudent, isAdmin } = useAuth();
  const location = useLocation();

  const redirectPath = useMemo(() => {
    if (!isAuthenticated) {
      return "/login";
    }

    if (allowedRoles) {
      if (allowedRoles.includes("TEACHER") && !isTeacher()) {
        return "/student";
      }
      if (allowedRoles.includes("STUDENT") && !isStudent()) {
        return "/teacher";
      }
      if (allowedRoles.includes("ADMIN") && !isAdmin()) {
        return "/teacher";
      }
    }

    return null;
  }, [isAuthenticated, isTeacher, isStudent, isAdmin, allowedRoles]);

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirect root to login if not authenticated */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="streaming" element={<Streaming />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Course />} />
            <Route path="classes" element={<Classes />} />
            <Route path="consumer" element={<Consumer />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Course />} />
            <Route path="classes" element={<Classes />} />
          </Route>

          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
