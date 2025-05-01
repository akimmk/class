import React from "react";

const Timetable = () => {
  const timeSlots = [
    {
      time: "08:00 AM-08:45 AM",
      subject: "English",
      unit: "Unit 2 -Suplementary",
      chapter: "Chapter 7 - The midnight visitor",
      teacher: "Catherin",
    },
    {
      time: "08:45 AM-09:30 AM",
      subject: "Maths",
      unit: "Unit 2 -Suplementary",
      chapter: "Chapter 7 - Fourier Series",
      teacher: "Catherin",
    },
    {
      time: "09:30 AM-10:15 AM",
      subject: "Physics",
      unit: "Unit 2 -Suplementary",
      chapter: "Chapter 7 - Fourier Series",
      teacher: "Catherin",
    },
    {
      time: "10:15 AM-11:00 AM",
      subject: "Botany",
      unit: "Unit 2 -Suplementary",
      chapter: "Chapter 7 - Fourier Series",
      teacher: "Catherin",
    },
    {
      time: "11:00 AM-11:45 AM",
      subject: "Tamil",
      unit: "Unit 2 -Suplementary",
      chapter: "Chapter 7 - Fourier Series",
      teacher: "Catherin",
    },
    {
      time: "11:45 AM-12:30 PM",
      subject: "Chemistry",
      unit: "Unit 2 -Suplementary",
      chapter: "Chapter 7 - Fourier Series",
      teacher: "Catherin",
    },
  ];

  const weekDays = [
    { day: "Mon", date: "01" },
    { day: "Tue", date: "02", isActive: true },
    { day: "Wed", date: "03" },
    { day: "Thu", date: "04" },
    { day: "Fri", date: "05" },
  ];

  return (
    <div className="timetable-section">
      <div className="timetable-header">
        <h2>Timetable</h2>
        <div className="month-selector">Apr, 2022</div>
      </div>

      <div className="week-days">
        {weekDays.map((day) => (
          <div
            key={day.date}
            className={`day-item ${day.isActive ? "active" : ""}`}
          >
            <span className="day">{day.day}</span>
            <span className="date">{day.date}</span>
          </div>
        ))}
      </div>

      <div className="time-slots-container">
        <div className="time-slots">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`time-slot ${slot.subject.toLowerCase()}`}
            >
              <div className="time">{slot.time}</div>
              <div className="class-details">
                <div className="subject-name">
                  <span className="subject-icon"></span>
                  {slot.subject}
                </div>
                <div className="class-info">
                  {slot.unit} {slot.chapter}
                </div>
                <div className="teacher">
                  <img
                    src="/teacher-avatar.png"
                    alt={slot.teacher}
                    className="teacher-avatar"
                  />
                  {slot.teacher}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;

