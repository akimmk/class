import React, { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard.jsx";
import { courseService } from "../utils/api";

const Course = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.fetchCourses();
        setCourses(data); // `data` is already the `content` array
      } catch (err) {
        setError(err.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    // Add defensive checks for `courseName` and `teacher`
    const courseName = course.courseName || ""; // Default to an empty string if undefined
    const teacher = course.teacher || ""; // Default to an empty string if undefined
    console.log(course);
    return (
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

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
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Course;
