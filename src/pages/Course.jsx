import React, { useState } from "react";

const Course = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const courses = [
    {
      id: 1,
      name: "Physics",
      teacher: "Dr. Sarah Wilson",
      progress: 68,
      nextClass: "Tomorrow, 10:15 AM",
      totalLessons: 24,
      completedLessons: 16,
      color: "#FF4500",
      icon: "science"
    },
    {
      id: 2,
      name: "Mathematics",
      teacher: "Prof. John Smith",
      progress: 75,
      nextClass: "Today, 2:30 PM",
      totalLessons: 30,
      completedLessons: 22,
      color: "#32CD32",
      icon: "functions"
    },
    {
      id: 3,
      name: "Chemistry",
      teacher: "Dr. Emily Brown",
      progress: 45,
      nextClass: "Wednesday, 11:00 AM",
      totalLessons: 28,
      completedLessons: 12,
      color: "#FFD700",
      icon: "science"
    },
    {
      id: 4,
      name: "Biology",
      teacher: "Prof. Michael Chen",
      progress: 90,
      nextClass: "Thursday, 9:00 AM",
      totalLessons: 26,
      completedLessons: 23,
      color: "#4169E1",
      icon: "biotech"
    },
    {
      id: 5,
      name: "English Literature",
      teacher: "Ms. Rachel Green",
      progress: 82,
      nextClass: "Friday, 1:15 PM",
      totalLessons: 20,
      completedLessons: 16,
      color: "#FF69B4",
      icon: "menu_book"
    },
    {
      id: 6,
      name: "Computer Science",
      teacher: "Mr. David Miller",
      progress: 60,
      nextClass: "Monday, 3:45 PM",
      totalLessons: 32,
      completedLessons: 19,
      color: "#9370DB",
      icon: "computer"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "inProgress") return matchesSearch && (course.progress > 0 && course.progress < 100);
    if (selectedFilter === "completed") return matchesSearch && course.progress === 100;
    return matchesSearch;
  });

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>My Courses</h1>
        <div className="courses-actions">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <button
              className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All Courses
            </button>
            <button
              className={`filter-btn ${selectedFilter === 'inProgress' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('inProgress')}
            >
              In Progress
            </button>
            <button
              className={`filter-btn ${selectedFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header" style={{ backgroundColor: course.color + '10' }}>
              <div className="course-icon" style={{ backgroundColor: course.color }}>
                <span className="material-icons" style={{ color: 'white' }}>{course.icon}</span>
              </div>
              <div className="course-progress">
                <div className="progress-circle">
                  <div className="progress-text">{course.progress}%</div>
                </div>
              </div>
            </div>
            <div className="course-content">
              <h3 className="course-name">{course.name}</h3>
              <p className="course-teacher">{course.teacher}</p>
              <div className="course-stats">
                <div className="stat">
                  <span className="material-icons">book</span>
                  <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                </div>
                <div className="stat">
                  <span className="material-icons">schedule</span>
                  <span>{course.nextClass}</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="continue-btn">
                  Continue Learning
                  <span className="material-icons">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course;
