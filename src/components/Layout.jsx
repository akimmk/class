import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import defaultAvatar from "../assets/default-avatar.svg";

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="user-header flex justify-between items-center gap-4 p-4 border-b border-gray-200">
            <div className="user-info text-md flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2">
              <span className="user-name font-bold text-xl">Welcome Michael 👋 </span>
            </div>
            <div className="flex items-center gap-4 border border-gray-200 rounded-full px-4 py-2">
          <div className="notifications">
            <span className="material-icons text-gray-600 cursor-pointer">notifications</span>
          </div>
          <div className="user-profile flex items-center gap-2">
            <img src={defaultAvatar} alt="User avatar" className="avatar w-10 h-10 rounded-full" />
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
