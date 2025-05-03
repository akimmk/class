import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div
        className="course-header"
        style={{ backgroundColor: course.color + "10" }}
      >
        <div
          className="course-icon"
          style={{ backgroundColor: course.color }}
        >
          <span
            className="material-icons"
            style={{ color: "white" }}
          >
            {course.icon}
          </span>
        </div>
      </div>
      <div className="course-content">
        <h3 className="course-name">{course.name}</h3>
        <p className="course-teacher">{course.teacher}</p>
        <div className="course-stats">
          <div className="stat">
            <p>Credit Hour : {course.credit}</p>
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
  );
};

export default CourseCard;