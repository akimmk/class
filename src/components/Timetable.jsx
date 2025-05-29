import React, { useState, useEffect } from "react";
import TimeSlot from "../components/TimeSlot.jsx";
import { classService } from "../utils/api";
import { useAuth } from "../context/AuthContext.jsx";

const Timetable = () => {
  const [activeDay, setActiveDay] = useState("02");
  const [classes, setClasses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;
      try {
        const response = await classService.featchClasses(user);
        console.log("Fetched Classes:", response);
        setClasses(response);
      } catch (error) {
        setClasses([]);
      }
    };
    fetchClasses();
  }, [user]);

  // Group classes by day (using startingDate)
  const timeSlotsByDay = classes.reduce((acc, classItem) => {
    console.log("Class Item:", classItem);
    if (!classItem.startingDate) return acc;
    const date = new Date(classItem.startingDate);
    const day = ("0" + date.getDate()).slice(-2); // e.g., "01", "02"
    if (!acc[day]) acc[day] = [];
    acc[day].push({
      time: `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${classItem.endingDate ? new Date(classItem.endingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`,
      subject: classItem.name,
      unit: classItem.description,
      chapter: classItem.description,
      teacher: classItem.instructorName || "",
    });
    return acc;
  }, {});

  // Calculate current week days dynamically
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  // Get Monday of the current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  // Build weekDays array for Mon-Fri
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      date: ("0" + d.getDate()).slice(-2),
      fullDate: d,
    };
  });

  // Set initial activeDay to today if in week, else Monday
  useEffect(() => {
    const todayDate = ("0" + today.getDate()).slice(-2);
    const found = weekDays.find((d) => d.date === todayDate);
    setActiveDay(found ? todayDate : weekDays[0].date);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="timetable-section">
      <div className="timetable-header">
        <h2>Timetable</h2>
        <div className="month-selector">
          {weekDays[0].fullDate.toLocaleString(undefined, { month: "long" })}, {weekDays[0].fullDate.getFullYear()}
        </div>
      </div>
      <div className="week-days">
        {weekDays.map((day) => (
          <div
            key={day.date}
            className={`day-item ${activeDay === day.date ? "active" : ""}`}
            onClick={() => setActiveDay(day.date)}
          >
            <span className="day">{day.day}</span>
            <span className="date">{day.date}</span>
          </div>
        ))}
      </div>
      <div className="time-slots-container">
        <div className="time-slots">
          {timeSlotsByDay[activeDay]?.map((slot, index) => (
            <TimeSlot
              key={index}
              time={slot.time}
              subject={slot.subject}
              unit={slot.unit}
              chapter={slot.chapter}
              teacher={slot.teacher}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;

