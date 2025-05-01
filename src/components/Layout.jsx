import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import defaultAvatar from "../assets/default-avatar.svg";

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="user-header">
          <div className="notifications">
            <span className="material-icons">notifications</span>
          </div>
          <div className="user-profile">
            <img src={defaultAvatar} alt="User avatar" className="avatar" />
            <div className="user-info">
              <span className="user-name">Michael</span>
              <span className="user-class"></span>
            </div>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
