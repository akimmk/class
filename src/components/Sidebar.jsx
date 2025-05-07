import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/classpilot-logo.svg";

const Sidebar = () => {
  const navItems = [
    { icon: "dashboard", label: "Dashboard", path: "/" },
    { icon: "school", label: "Teacher Dashboard", path: "/teacher" },
    { icon: "book", label: "Courses", path: "/courses" },
    { icon: "schedule", label: "Classes", path: "/classes" },
    { icon: "videocam", label: "Streaming", path: "/streaming" },
    { icon: "play_circle", label: "View Stream", path: "/consumer" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="logo" />
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
  );
};

export default Sidebar;
