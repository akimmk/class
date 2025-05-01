import React from "react";
import Timetable from "../components/Timetable.jsx";

const Dashboard = () => {
  const classNotices = [
    { date: "26 Jan 2022", title: "Jan 26 will be holiday" },
    { date: "05 Feb 2022", title: "Class field trip" },
    { date: "06 Feb 2022", title: "Physics special class" },
    { date: "06 Feb 2022", title: "Botany revision test" },
    { date: "06 Feb 2022", title: "Chemistry Special class" },
    { date: "16 Feb 2022", title: "Maths special class" },
  ];

  const attendanceData = {
    present: 153,
    absent: 17,
    total: 170,
    currentMonth: 30,
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          <Timetable />

          {/* Attendance Section */}
          <div className="attendance-section">
            <h2>My Attendance</h2>
            <div className="attendance-stats">
              <div className="attendance-numbers">
                <div className="stat-item">
                  <span className="label">Present</span>
                  <span className="value">{attendanceData.present}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Absent</span>
                  <span className="value">{attendanceData.absent}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Total Working days</span>
                  <span className="value">{attendanceData.total}</span>
                </div>
              </div>
              <div className="current-month">
                <span className="days">{attendanceData.currentMonth}</span>
                <span className="label">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Class Noticeboard */}
          <div className="noticeboard class-notices">
            <h2>Class Noticeboard</h2>
            <div className="notices-list">
              {classNotices.map((notice, index) => (
                <div key={index} className="notice-item">
                  <div className="notice-date">{notice.date}</div>
                  <div className="notice-title">{notice.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* School Noticeboard */}
          <div className="noticeboard school-notices">
            <h2>School Noticeboard</h2>
            <div className="school-notice-image">
              <img
                src="/school-notice-image.jpg"
                alt="School basketball game"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
