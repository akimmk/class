import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import defaultAvatar from "../assets/default-avatar.svg";

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="user-header flex justify-end items-center gap-4 p-4 border-b border-gray-200">
          <div className="notifications">
            <span className="material-icons text-gray-600 cursor-pointer">notifications</span>
          </div>
          <div className="user-profile flex items-center gap-2">
            <img src={defaultAvatar} alt="User avatar" className="avatar w-10 h-10 rounded-full" />
            <div className="user-info text-sm">
              <span className="user-name font-medium">Michael</span>
              <span className="user-class text-gray-500 text-xs"></span>
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
