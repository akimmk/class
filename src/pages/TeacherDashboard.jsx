import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - In a real app, this would come from an API
  const upcomingLabs = [
=======
  const [activeTab, setActiveTab] = useState("upcoming");

  // Sample data - In a real app, this would come from your backend
  const upcomingSessions = [
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
    {
      id: 1,
      subject: "Physics Lab",
      date: "2024-03-25",
      time: "10:00 AM - 12:00 PM",
<<<<<<< HEAD
      room: "Lab 101",
      students: 24,
      status: "confirmed"
=======
      students: 24,
      lab: "Lab 101",
      status: "scheduled"
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
    },
    {
      id: 2,
      subject: "Chemistry Lab",
      date: "2024-03-26",
      time: "02:00 PM - 04:00 PM",
<<<<<<< HEAD
      room: "Lab 203",
      students: 28,
      status: "pending"
=======
      students: 20,
      lab: "Lab 203",
      status: "scheduled"
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
    }
  ];

  const assignedClasses = [
    {
      id: 1,
      name: "Physics 101",
<<<<<<< HEAD
      students: 32,
      schedule: "Mon, Wed, Fri 10:00 AM",
      room: "Room 301",
      nextClass: "2024-03-25 10:00 AM"
=======
      students: 30,
      schedule: "Mon, Wed 10:00 AM",
      room: "Room 301",
      nextSession: "2024-03-25"
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
    },
    {
      id: 2,
      name: "Chemistry 201",
<<<<<<< HEAD
      students: 28,
      schedule: "Tue, Thu 02:00 PM",
      room: "Room 205",
      nextClass: "2024-03-26 02:00 PM"
=======
      students: 25,
      schedule: "Tue, Thu 02:00 PM",
      room: "Room 205",
      nextSession: "2024-03-26"
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
    }
  ];

  const studentList = [
    {
      id: 1,
      name: "John Doe",
<<<<<<< HEAD
      email: "john.doe@example.com",
      attendance: "92%",
      submissions: "15/16",
      lastActive: "2024-03-24"
=======
      class: "Physics 101",
      attendance: "85%",
      submissions: "8/10"
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
    },
    {
      id: 2,
      name: "Jane Smith",
<<<<<<< HEAD
      email: "jane.smith@example.com",
      attendance: "95%",
      submissions: "16/16",
      lastActive: "2024-03-24"
=======
      class: "Chemistry 201",
      attendance: "92%",
      submissions: "9/10"
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
    }
  ];

  const resourceBookings = [
    {
      id: 1,
<<<<<<< HEAD
      resource: "Projector",
      date: "2024-03-25",
      time: "10:00 AM - 12:00 PM",
      status: "approved"
    },
    {
      id: 2,
      resource: "Lab Equipment Set A",
=======
      resource: "Lab 101",
      date: "2024-03-25",
      time: "10:00 AM - 12:00 PM",
      status: "confirmed"
    },
    {
      id: 2,
      resource: "Projector Room",
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
      date: "2024-03-26",
      time: "02:00 PM - 04:00 PM",
      status: "pending"
    }
  ];

<<<<<<< HEAD
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
=======
  const renderSessionCard = (session) => (
    <div key={session.id} className="session-card">
      <div className="session-header">
        <h3>{session.subject}</h3>
        <span className={`status-badge ${session.status}`}>
          {session.status}
        </span>
      </div>
      <div className="session-details">
        <div className="detail-item">
          <span className="material-icons">event</span>
          <span>{session.date}</span>
        </div>
        <div className="detail-item">
          <span className="material-icons">schedule</span>
          <span>{session.time}</span>
        </div>
        <div className="detail-item">
          <span className="material-icons">location_on</span>
          <span>{session.lab}</span>
        </div>
        <div className="detail-item">
          <span className="material-icons">people</span>
          <span>{session.students} students</span>
        </div>
      </div>
      <div className="session-actions">
        <button className="action-btn primary" onClick={() => navigate(`/classes/${session.id}`)}>
          Start Session
        </button>
        <button className="action-btn secondary">
          View Roster
        </button>
      </div>
    </div>
  );

  const renderClassCard = (classItem) => (
    <div key={classItem.id} className="class-card">
      <div className="class-header">
        <h3>{classItem.name}</h3>
        <span className="student-count">{classItem.students} students</span>
      </div>
      <div className="class-details">
        <div className="detail-item">
          <span className="material-icons">schedule</span>
          <span>{classItem.schedule}</span>
        </div>
        <div className="detail-item">
          <span className="material-icons">room</span>
          <span>{classItem.room}</span>
        </div>
        <div className="detail-item">
          <span className="material-icons">event</span>
          <span>Next: {classItem.nextSession}</span>
        </div>
      </div>
      <div className="class-actions">
        <button className="action-btn primary" onClick={() => navigate(`/classes/${classItem.id}/roster`)}>
          Manage Roster
        </button>
        <button className="action-btn secondary">
          View Attendance
        </button>
      </div>
    </div>
  );

  const renderStudentRow = (student) => (
    <tr key={student.id}>
      <td>{student.name}</td>
      <td>{student.class}</td>
      <td>{student.attendance}</td>
      <td>{student.submissions}</td>
      <td>
        <button className="action-btn small" onClick={() => navigate(`/students/${student.id}`)}>
          View Details
        </button>
      </td>
    </tr>
  );

  const renderResourceBooking = (booking) => (
    <div key={booking.id} className="booking-card">
      <div className="booking-header">
        <h3>{booking.resource}</h3>
        <span className={`status-badge ${booking.status}`}>
          {booking.status}
        </span>
      </div>
      <div className="booking-details">
        <div className="detail-item">
          <span className="material-icons">event</span>
          <span>{booking.date}</span>
        </div>
        <div className="detail-item">
          <span className="material-icons">schedule</span>
          <span>{booking.time}</span>
        </div>
      </div>
      <div className="booking-actions">
        <button className="action-btn secondary">
          Modify Booking
        </button>
        {booking.status === "pending" && (
          <button className="action-btn danger">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="header-actions">
<<<<<<< HEAD
          <button className="primary-btn" onClick={handleScheduleSession}>
            <span className="material-icons">add</span>
            Schedule New Session
          </button>
=======
          <button className="action-btn primary" onClick={() => navigate("/schedule-session")}>
            Schedule New Session
          </button>
          <button className="action-btn secondary" onClick={() => navigate("/book-resource")}>
            Book Resource
          </button>
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
<<<<<<< HEAD
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
=======
          className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Sessions
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
        </button>
        <button
          className={`tab-btn ${activeTab === "classes" ? "active" : ""}`}
          onClick={() => setActiveTab("classes")}
        >
<<<<<<< HEAD
          Classes
=======
          Assigned Classes
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
        </button>
        <button
          className={`tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
<<<<<<< HEAD
          Students
=======
          Student List
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
        </button>
        <button
          className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
<<<<<<< HEAD
          Resources
=======
          Resource Bookings
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
        </button>
      </div>

      <div className="dashboard-content">
<<<<<<< HEAD
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
=======
        {activeTab === "upcoming" && (
          <div className="sessions-grid">
            {upcomingSessions.map(renderSessionCard)}
          </div>
        )}

        {activeTab === "classes" && (
          <div className="classes-grid">
            {assignedClasses.map(renderClassCard)}
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
          </div>
        )}

        {activeTab === "students" && (
<<<<<<< HEAD
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
=======
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Attendance</th>
                  <th>Submissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map(renderStudentRow)}
              </tbody>
            </table>
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
          </div>
        )}

        {activeTab === "resources" && (
<<<<<<< HEAD
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
=======
          <div className="bookings-grid">
            {resourceBookings.map(renderResourceBooking)}
>>>>>>> 5a7a7d96e1984e2d30a9183dba0f204c92096049
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard; 