import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - In a real app, this would come from an API
  const upcomingLabs = [
    {
      id: 1,
      subject: "Physics Lab",
      date: "2024-03-25",
      time: "10:00 AM - 12:00 PM",
      room: "Lab 101",
      students: 24,
      status: "confirmed"
    },
    {
      id: 2,
      subject: "Chemistry Lab",
      date: "2024-03-26",
      time: "02:00 PM - 04:00 PM",
      room: "Lab 203",
      students: 28,
      status: "pending"
    }
  ];

  const assignedClasses = [
    {
      id: 1,
      name: "Physics 101",
      students: 32,
      schedule: "Mon, Wed, Fri 10:00 AM",
      room: "Room 301",
      nextClass: "2024-03-25 10:00 AM"
    },
    {
      id: 2,
      name: "Chemistry 201",
      students: 28,
      schedule: "Tue, Thu 02:00 PM",
      room: "Room 205",
      nextClass: "2024-03-26 02:00 PM"
    }
  ];

  const studentList = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      attendance: "92%",
      submissions: "15/16",
      lastActive: "2024-03-24"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      attendance: "95%",
      submissions: "16/16",
      lastActive: "2024-03-24"
    }
  ];

  const resourceBookings = [
    {
      id: 1,
      resource: "Projector",
      date: "2024-03-25",
      time: "10:00 AM - 12:00 PM",
      status: "approved"
    },
    {
      id: 2,
      resource: "Lab Equipment Set A",
      date: "2024-03-26",
      time: "02:00 PM - 04:00 PM",
      status: "pending"
    }
  ];

  const handleScheduleSession = () => {
    // Implement session scheduling logic
    console.log("Schedule new session");
  };

  const handleManageRoster = (classId) => {
    // Implement roster management logic
    console.log("Manage roster for class:", classId);
  };

  const handleViewAttendance = (classId) => {
    // Implement attendance view logic
    console.log("View attendance for class:", classId);
  };

  const handleMessageStudent = (studentId) => {
    // Implement student messaging logic
    console.log("Message student:", studentId);
  };

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="header-actions">
          <button className="primary-btn" onClick={handleScheduleSession}>
            <span className="material-icons">add</span>
            Schedule New Session
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "classes" ? "active" : ""}`}
          onClick={() => setActiveTab("classes")}
        >
          Classes
        </button>
        <button
          className={`tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
        <button
          className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-grid">
            {/* Upcoming Labs Section */}
            <div className="dashboard-card">
              <h2>Upcoming Lab Sessions</h2>
              <div className="card-content">
                {upcomingLabs.map((lab) => (
                  <div key={lab.id} className="lab-item">
                    <div className="lab-info">
                      <h3>{lab.subject}</h3>
                      <p>{lab.date} | {lab.time}</p>
                      <p>Room: {lab.room}</p>
                    </div>
                    <div className="lab-status">
                      <span className={`status-badge ${lab.status}`}>
                        {lab.status}
                      </span>
                      <span className="student-count">
                        {lab.students} students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Classes Section */}
            <div className="dashboard-card">
              <h2>Assigned Classes</h2>
              <div className="card-content">
                {assignedClasses.map((classItem) => (
                  <div key={classItem.id} className="class-item">
                    <div className="class-info">
                      <h3>{classItem.name}</h3>
                      <p>{classItem.schedule}</p>
                      <p>Room: {classItem.room}</p>
                    </div>
                    <div className="class-actions">
                      <button
                        className="action-btn"
                        onClick={() => handleManageRoster(classItem.id)}
                      >
                        Manage Roster
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleViewAttendance(classItem.id)}
                      >
                        View Attendance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="dashboard-card">
            <h2>Student List</h2>
            <div className="table-container">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Attendance</th>
                    <th>Submissions</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.attendance}</td>
                      <td>{student.submissions}</td>
                      <td>{student.lastActive}</td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleMessageStudent(student.id)}
                        >
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="dashboard-card">
            <h2>Resource Bookings</h2>
            <div className="card-content">
              {resourceBookings.map((booking) => (
                <div key={booking.id} className="resource-item">
                  <div className="resource-info">
                    <h3>{booking.resource}</h3>
                    <p>{booking.date} | {booking.time}</p>
                  </div>
                  <div className="resource-status">
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard; 