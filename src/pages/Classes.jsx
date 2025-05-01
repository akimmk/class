import React, { useState } from "react";

const Classes = () => {
  const [activeTab, setActiveTab] = useState("live");

  const liveClasses = [
    {
      id: 1,
      subject: "Physics",
      teacher: "Dr. Sarah Wilson",
      time: "10:15 AM - 11:00 AM",
      duration: "45 mins",
      students: 28,
      status: "live",
      joinLink: "#",
      color: "#FF4500",
      icon: "science"
    },
    {
      id: 2,
      subject: "Mathematics",
      teacher: "Prof. John Smith",
      time: "11:00 AM - 11:45 AM",
      duration: "45 mins",
      students: 32,
      status: "live",
      joinLink: "#",
      color: "#32CD32",
      icon: "functions"
    }
  ];

  const scheduledClasses = [
    {
      id: 3,
      subject: "Chemistry",
      teacher: "Dr. Emily Brown",
      date: "Tomorrow",
      time: "09:30 AM - 10:15 AM",
      duration: "45 mins",
      students: 30,
      status: "scheduled",
      color: "#FFD700",
      icon: "science"
    },
    {
      id: 4,
      subject: "Biology",
      teacher: "Prof. Michael Chen",
      date: "Wednesday",
      time: "02:30 PM - 03:15 PM",
      duration: "45 mins",
      students: 25,
      status: "scheduled",
      color: "#4169E1",
      icon: "biotech"
    }
  ];

  const pastClasses = [
    {
      id: 5,
      subject: "English Literature",
      teacher: "Ms. Rachel Green",
      date: "Today",
      time: "08:00 AM - 08:45 AM",
      duration: "45 mins",
      students: 35,
      status: "completed",
      recordingLink: "#",
      color: "#FF69B4",
      icon: "menu_book"
    },
    {
      id: 6,
      subject: "Computer Science",
      teacher: "Mr. David Miller",
      date: "Yesterday",
      time: "03:30 PM - 04:15 PM",
      duration: "45 mins",
      students: 40,
      status: "completed",
      recordingLink: "#",
      color: "#9370DB",
      icon: "computer"
    }
  ];

  const renderClassCard = (classItem) => (
    <div key={classItem.id} className="class-card">
      <div className="class-header" style={{ backgroundColor: classItem.color + '10' }}>
        <div className="class-icon" style={{ backgroundColor: classItem.color }}>
          <span className="material-icons" style={{ color: 'white' }}>{classItem.icon}</span>
        </div>
        <div className="class-status">
          <span className={`status-badge ${classItem.status}`}>
            {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="class-content">
        <h3 className="class-subject">{classItem.subject}</h3>
        <p className="class-teacher">{classItem.teacher}</p>
        <div className="class-info">
          <div className="info-item">
            <span className="material-icons">schedule</span>
            <span>{classItem.time}</span>
          </div>
          {classItem.date && (
            <div className="info-item">
              <span className="material-icons">event</span>
              <span>{classItem.date}</span>
            </div>
          )}
          <div className="info-item">
            <span className="material-icons">people</span>
            <span>{classItem.students} students</span>
          </div>
        </div>
        <div className="class-actions">
          {classItem.status === "live" && (
            <a href={classItem.joinLink} className="join-btn">
              Join Class
              <span className="material-icons">video_call</span>
            </a>
          )}
          {classItem.status === "completed" && (
            <a href={classItem.recordingLink} className="view-btn">
              View Recording
              <span className="material-icons">play_circle</span>
            </a>
          )}
          {classItem.status === "scheduled" && (
            <button className="reminder-btn">
              Set Reminder
              <span className="material-icons">notifications</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="classes-container">
      <div className="classes-header">
        <h1>Classes</h1>
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            Live Classes
            <span className="badge">{liveClasses.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            Scheduled
            <span className="badge">{scheduledClasses.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Classes
            <span className="badge">{pastClasses.length}</span>
          </button>
        </div>
      </div>

      <div className="classes-grid">
        {activeTab === 'live' && liveClasses.map(renderClassCard)}
        {activeTab === 'scheduled' && scheduledClasses.map(renderClassCard)}
        {activeTab === 'past' && pastClasses.map(renderClassCard)}
      </div>
    </div>
  );
};

export default Classes; 