import React, { useState } from "react";
import ClassListWindow from "../components/ClassListWindow.jsx";

const CourseCard = ({ course }) => {
  const [showClassList, setShowClassList] = useState(false);

  const handleContinueLearning = () => {
    setShowClassList(true);
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
          <p className="course-teacher">Instructor : {course.instructors}</p>
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

      {showClassList && (
        <ClassListWindow
          course={course}
          onClose={() => setShowClassList(false)}
        />
      )}
    </>
  );
};

export default CourseCard;
