import React from 'react';

const ClassListWindow = ({ course, onClose }) => {
  // This would typically come from your backend/database
  const classes = [
    { id: 1, title: 'Introduction to Course', date: '2024-03-20', duration: '1h 30m' },
    { id: 2, title: 'Basic Concepts', date: '2024-03-22', duration: '1h 45m' },
    { id: 3, title: 'Advanced Topics', date: '2024-03-25', duration: '2h' },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 ml-64">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold">{course.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>Teacher: {course.teacher}</span>
                <span>•</span>
                <span>Credit Hours: {course.credit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div 
                key={classItem.id}
                className="course-card"
              >
                <div
                  className="course-header"
                  style={{ backgroundColor: course.color + "10" }}
                >
                  <div
                    className="course-icon"
                    style={{ backgroundColor: course.color }}
                  >
                    <span className="material-icons" style={{ color: "white" }}>
                      school
                    </span>
                  </div>
                </div>
                <div className="course-content">
                  <h3 className="course-name">{classItem.title}</h3>
                  <div className="course-stats">
                    <div className="stat">
                      <p className="flex items-center">
                        <span className="material-icons text-gray-400 mr-2 text-sm">calendar_today</span>
                        {classItem.date}
                      </p>
                      <p className="flex items-center">
                        <span className="material-icons text-gray-400 mr-2 text-sm">schedule</span>
                        {classItem.duration}
                      </p>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button className="continue-btn">
                      Start Class
                      <span className="material-icons">play_circle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassListWindow; 