import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Course from "./pages/Course.jsx";
import Classes from "./pages/Classes.jsx";
import Attendance from "./pages/Attendance.jsx";
import "./index.css";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Course />} />
          <Route path="classes" element={<Classes />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
