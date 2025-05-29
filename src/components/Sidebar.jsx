import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { isTeacher, isStudent, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const teacherNavItems = [
    { icon: "dashboard", label: "Teacher Dashboard", path: "/teacher" },
    { icon: "book", label: "Courses", path: "/teacher/courses" },
    { icon: "schedule", label: "Classes", path: "/teacher/classes" },
  ];

  const studentNavItems = [
    { icon: "dashboard", label: "Dashboard", path: "/student" },
    { icon: "book", label: "Courses", path: "/student/courses" },
    { icon: "schedule", label: "Classes", path: "/student/classes" },
  ];

  const adminNavItems = [
    { icon: "dashboard", label: "Admin Dashboard", path: "/admin" },
    { icon: "book", label: "Courses", path: "/admin/courses" },
    { icon: "schedule", label: "Classes", path: "/admin/classes" },
    { icon: "people", label: "Users", path: "/admin/users" },
  ];

  const navItems = isAdmin()
    ? adminNavItems
    : isTeacher()
      ? teacherNavItems
      : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar flex flex-col h-full">
      <div>
        <div className="sidebar-header">
          <span className="material-icons">school</span>
          <h1 className="brand">ClassPilot</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="nav-item">
              <span className="material-icons">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="mt-auto mx-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1"
      >
        <span className="material-icons">logout</span>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
