import React, { useState } from "react";
import CourseCard from "../components/CourseCard.jsx";

const Course = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const courses = [
    {
      id: 1,
      name: "Physics",
      teacher: "Dr. Sarah Wilson",
      credit: 68,
      color: "#FF4500",
      icon: "science"
    },
    {
      id: 2,
      name: "Mathematics",
      teacher: "Prof. John Smith",
      credit: 75,
      color: "#32CD32",
      icon: "functions"
    },
    {
      id: 3,
      name: "Chemistry",
      teacher: "Dr. Emily Brown",
      credit: 45,
      color: "#FFD700",
      icon: "science"
    },
    {
      id: 4,
      name: "Biology",
      teacher: "Prof. Michael Chen",
      credit: 90,
      color: "#4169E1",
      icon: "biotech"
    },
    {
      id: 5,
      name: "English Literature",
      teacher: "Ms. Rachel Green",
      credit: 82,
      color: "#FF69B4",
      icon: "menu_book"
    },
    {
      id: 6,
      name: "Computer Science",
      teacher: "Mr. David Miller",
      credit: 60,
      nextClass: "Monday, 3:45 PM",
      totalLessons: 32,
      completedLessons: 19,
      color: "#9370DB",
      icon: "computer"
    }
  ];

  const filteredCourses = courses.filter(course => {
    return course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
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
              className="filter-btn active"
              onClick={() => setSelectedFilter('all')}
            >
              All Courses
            </button>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Course;
