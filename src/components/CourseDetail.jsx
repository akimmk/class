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
      <div className="course-header bg-white rounded-lg shadow-md p-6 flex items-center gap-6 mb-8">
        <div
          className="course-icon flex items-center justify-center w-20 h-20 rounded-xl"
          style={{ backgroundColor: course.color || "#6366F1" }}
        >
          <span className="material-icons text-4xl text-white">
            {course.icon || "school"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            {course.courseName}
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-medium">
              <span className="material-icons text-base">person</span>
              Instructor:{" "}
              <span className="font-semibold">{course.instructors}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full text-green-700 font-medium">
              <span className="material-icons text-base">schedule</span>
              Credit Hours:{" "}
              <span className="font-semibold">{course.credits}</span>
            </div>
          </div>
        </div>
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
