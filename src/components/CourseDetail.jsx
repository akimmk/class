import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../utils/api";

const CourseDetail = () => {
  const { courseId } = useParams();
  console.log(courseId);
  const [course, setCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseData = await courseService.getCourseById(courseId);
        console.log(courseData);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <div className="course-icon" style={{ backgroundColor: course.color }}>
          <span className="material-icons" style={{ color: "white" }}>
            {course.icon}
          </span>
        </div>
        <h2>{course.courseName}</h2>
        <p>Instructor: {course.instructors}</p>
        <p>Credit Hours: {course.credits}</p>
      </div>

      <div className="course-classes">
        <h3>Classes</h3>
        {classes.length === 0 ? (
          <p>No classes found for this course</p>
        ) : (
          <div className="classes-list">
            {classes.map((classItem) => (
              <div key={classItem.id} className="class-item">
                <h4>{classItem.name}</h4>
                <p>Time: {classItem.time}</p>
                <p>Location: {classItem.location}</p>
                <p>Capacity: {classItem.capacity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
