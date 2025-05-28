import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateClassPopup from "../components/CreateClassPopup.jsx";

const TeacherClasses = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // Sample data - In a real app, this would come from your backend
  const [teacherClasses, setTeacherClasses] = useState([
    {
      id: 1,
      name: "Physics 101",
      students: 30,
      schedule: "Mon, Wed 10:00 AM",
      room: "Room 301",
      nextSession: "2024-03-25",
    },
    {
      id: 2,
      name: "Chemistry 201",
      students: 25,
      schedule: "Tue, Thu 02:00 PM",
      room: "Room 205",
      nextSession: "2024-03-26",
    },
  ]);

  const handleCreateClass = (newClassData) => {
    // In a real app, you would send this data to your backend
    console.log("Creating class with data:", newClassData);
    // For now, just add it to the sample data with a unique ID
    const newClass = { ...newClassData, id: teacherClasses.length + 1 };
    setTeacherClasses([...teacherClasses, newClass]);
  };

  const renderClassCard = (classItem) => (
    <div key={classItem.id} className="class-card bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="class-header flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{classItem.name}</h3>
        <span className="text-sm text-gray-600">{classItem.students} students</span>
      </div>
      <div className="class-details text-sm text-gray-700 mb-4">
        <div className="detail-item flex items-center mb-1">
          <span className="material-icons text-base mr-2">schedule</span>
          <span>{classItem.schedule}</span>
        </div>
        <div className="detail-item flex items-center mb-1">
          <span className="material-icons text-base mr-2">room</span>
          <span>{classItem.room}</span>
        </div>
        <div className="detail-item flex items-center">
          <span className="material-icons text-base mr-2">event</span>
          <span>Next Session: {classItem.nextSession}</span>
        </div>
      </div>
      <div className="class-actions flex gap-2">
        <button
          className="action-btn primary bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(`/teacher/classes/${classItem.id}/details`)} // Placeholder route
        >
          View Details
        </button>
        <button
          className="action-btn secondary bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          onClick={() => navigate(`/teacher/classes/${classItem.id}/roster`)} // Placeholder route
        >
          Manage Roster
        </button>
      </div>
    </div>
  );

  return (
    <div className="teacher-classes p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <button
          className="action-btn primary bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
          onClick={() => setShowPopup(true)}
        >
          <span className="material-icons">add</span>
          Create New Class
        </button>
      </div>

      <div className="classes-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacherClasses.map(renderClassCard)}
      </div>

      {showPopup && (
        <CreateClassPopup
          onClose={() => setShowPopup(false)}
          onCreateClass={handleCreateClass}
        />
      )}
    </div>
  );
};

export default TeacherClasses;

