import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, user }) => {
  const navigate = useNavigate();

  const handleContinueLearning = () => {
    navigate(`/${user.role.toLowerCase()}/courses/${course.courseId}`);
  };

  return (
    <>
      <div className="course-card shadow-md round">
        <div
          className="course-header"
          style={{ backgroundColor: course.color + "10" }}
        >
          <div
            className="course-icon"
            style={{ backgroundColor: course.color }}
          >
            <span className="material-icons" style={{ color: "white" }}>
              {course.icon}
            </span>
          </div>
        </div>
        <div className="course-content text-black">
          <h3 className="course-name">{course.courseName}</h3>
          {course.instructors && (
            <p className="course-teacher">Instructor : {course.instructors}</p>
          )}
          {course.NoOfStudents && (
            <p className="no-of-students">
              Number of Students: {course.NoOfStudents}
            </p>
          )}
          <div className="course-stats">
            <div className="stat">
              <p>Credit Hour : {course.credits}</p>
            </div>
          </div>
          <div className="course-actions">
            <button className="continue-btn" onClick={handleContinueLearning}>
              Continue Learning
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCard;
