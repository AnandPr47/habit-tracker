import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import API from "../api/api";


function generateCalendar(month, year) {

  const firstDay = new Date(year, month - 1, 1).getDay();

  const daysInMonth = new Date(
    year,
    month,
    0
  ).getDate();

  const calendar = [];
  let week = new Array(7).fill(null);
  let dayIndex = firstDay;

  for (let day = 1; day <= daysInMonth; day++) {

    week[dayIndex] = day;
    dayIndex++;

    if (dayIndex === 7) {
      calendar.push(week);
      week = new Array(7).fill(null);
      dayIndex = 0;
    }
  }

  if (week.some(d => d !== null)) {
    calendar.push(week);
  }

  return calendar;
}

// “Dashboard component for managing habits, tracking progress/streaks, and rendering the calendar view.”
function Dashboard() {

  // states for habits and new habit input
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await API.get("/habits");
      setHabits(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addHabit = async () => {
    if (!title.trim()) return;

    try {
      await API.post("/habits", { title });
      setTitle("");

      fetchHabits();
      fetchMonthly();
      fetchAnalytics();

    } catch (err) {

      if (err.response && err.response.data.message) {
        alert("We can't add similar thing again. Try another habit ⚠️");
      } else {
        alert("Something went wrong");
      }

    }
  };


  // delete habit
  const deleteHabit = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this habit?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/habits/${id}`);
      fetchHabits();
      fetchMonthly();
    } catch (err) {
      console.log(err);
    }

  };

  // states for habit editing
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  // update habit title
  const updateHabit = async (id) => {

    if (!editTitle.trim()) return;

    try {

      await API.put(`/habits/${id}`, {
        title: editTitle
      });

      setEditingHabitId(null);
      setEditTitle("");

      fetchHabits();
      fetchMonthly();

    } catch (err) {
      console.log(err);
    }

  };

  const toggleHabit = async (habitId, day) => {

    const today = new Date();

    // clicked date
    const clickedDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      day
    );

    // remove time
    today.setHours(0, 0, 0, 0);

    // stop future dates
    if (clickedDate > today) {
      return;
    }

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    const date = `${year}-${formattedMonth}-${formattedDay}`;

    try {

      await API.post(`/habits/${habitId}/complete`, {
        date
      });

      fetchMonthly();

    } catch (err) {
      console.log(err);
    }
  };

  //------------------------------------------------------------------------------------------------------------------------------------------//
  const [monthData, setMonthData] = useState(null);

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    today.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear()
  );

  useEffect(() => {

    fetchMonthly();
    fetchHabits();
    fetchAnalytics();
    fetchUser();

  }, [selectedMonth, selectedYear])

  // fetch monthly habit data for calendar view
  const fetchMonthly = async () => {
    try {
      const month = selectedMonth;
      const year = selectedYear;

      const res = await API.get(
        `/habits/summary/month-details?month=${month}&year=${year}`
      );

      setMonthData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [analytics, setAnalytics] = useState(null)
  // monthly analytics for overall completion percentage
  const fetchAnalytics = async () => {

    try {

      const month = selectedMonth;
      const year = selectedYear;

      const res = await API.get(
        `/habits/summary/month-details?month=${month}&year=${year}`
      );

      setAnalytics(res.data);

    } catch (err) {
      console.log(err);
    }

  };

  // fetch user details
  const fetchUser = async () => {

    try {

      const res = await API.get("/auth/me");

      setUser(res.data);

    } catch (err) {
      console.log(err);
    }

  };


  // generate calendar for current month
  const calendar = generateCalendar(
    selectedMonth,
    selectedYear
  );
  const weeks = calendar;
  // This function takes the dailyStatus object, which contains the completion status of habits for each day of the month, and organizes it into weeks. It creates an array of weeks, where each week is an array of days. The function iterates through the days in the dailyStatus object and groups them into weeks based on their position in the month.
  const getWeeks = (dailyStatus) => {
    const days = Object.keys(dailyStatus);
    const weeks = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  // This function calculates the completion percentage of a habit for the current month based on the dailyStatus object, which contains the completion status for each day of the month. It counts the number of completed days and divides it by the total number of days in the current month to get the percentage of completion.
  const getProgress = (habit) => {

    const completedDays = Object.values(habit.dailyStatus || {})
      .filter(v => v === true).length;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const totalDays = new Date(year, month + 1, 0).getDate();

    const percent = Math.round((completedDays / totalDays) * 100);

    return percent;
  }

  // This function calculates the current streak of a habit based on the dailyStatus object, which contains the completion status for each day of the month. It iterates through the dailyStatus object in reverse order (starting from the most recent day) and counts how many consecutive days the habit has been completed. The streak count is incremented for each consecutive day that is marked as completed, and it stops counting when it encounters a day that is not completed.
  const getStreak = (habit) => {

    const status = habit.dailyStatus || {};

    const completedDays = Object.keys(status)
      .filter(day => status[day] === true)
      .map(Number)
      .sort((a, b) => b - a);

    if (completedDays.length === 0) return 0;

    let streak = 1;
    let lastDay = completedDays[0];

    for (let i = 1; i < completedDays.length; i++) {

      if (completedDays[i] === lastDay - 1) {
        streak++;
        lastDay = completedDays[i];
      } else {
        break;
      }

    }

    return streak;
  };




  // ----------------------------------------------------------------------------------------------------------------------------
  // rendering starts here
  return (
    <div className="dashboard">
      <div className="top-analytics">
        {analytics && (
          <div className="analytics-card">
            <h3>Monthly Progress</h3>
            <p>{analytics.overallPercentage}% completed</p>
          </div>
        )}
      </div>

      <div className="dashboard-container">

        <h1 className="dashboard-title">
          Your Habits
        </h1>

        {user && (
          <p className="joined-text">
            Joined on{" "}
            {new Date(user.createdAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric"
              }
            )}
          </p>
        )}

        <div className="month-switcher">

          <button
            onClick={() => {

              if (!user) return;

              const joinedDate = new Date(user.createdAt);

              const joinedMonth =
                joinedDate.getMonth() + 1;

              const joinedYear =
                joinedDate.getFullYear();

              const isJoinedMonth =
                selectedMonth === joinedMonth &&
                selectedYear === joinedYear;

              if (isJoinedMonth) return;

              if (selectedMonth === 1) {
                setSelectedMonth(12);
                setSelectedYear(prev => prev - 1);
              } else {
                setSelectedMonth(prev => prev - 1);
              }

            }}
          >
            ←
          </button>

          <h2>
            {new Date(
              selectedYear,
              selectedMonth - 1
            ).toLocaleString("default", {
              month: "long",
              year: "numeric"
            })}
          </h2>

          <button
            onClick={() => {
              const current = new Date();

              const isCurrentMonth =
                selectedMonth === current.getMonth() + 1 &&
                selectedYear === current.getFullYear();

              if (isCurrentMonth) return;

              if (selectedMonth === 12) {
                setSelectedMonth(1);
                setSelectedYear(prev => prev + 1);
              } else {
                setSelectedMonth(prev => prev + 1);
              }
            }}
          >
            →
          </button>

        </div>

        <div className="add-section">
          <input
            type="text"
            placeholder="Add a new habit..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addHabit}>
            + Add
          </button>
        </div>

        <div className="dashboard">
          <div className="monthly-tracker">

            {/* LEFT HABIT COLUMN */}
            <div className="habit-column">

              <div className="habit-header">
                Habits
              </div>

              <div className="habit-list">
                {monthData?.habits.map((habit, index) => (
                  <div className="habit-name" key={habit.habitId}>

                    {editingHabitId === habit.habitId ? (

                      <>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="edit-input"
                        />

                        <button
                          className="save-btn"
                          onClick={() => updateHabit(habit.habitId)}
                        >
                          ✓
                        </button>

                      </>

                    ) : (

                      <>
                        <span className="habit-text">
                          {index + 1}. {habit.title}
                        </span>

                        <span className="habit-stats">
                          🔥 {getStreak(habit)} | {getProgress(habit)}%
                        </span>

                        <div className="habit-actions">

                          <button
                            className="edit-btn"
                            onClick={() => {
                              setEditingHabitId(habit.habitId);
                              setEditTitle(habit.title);
                            }}
                          >
                            ✏
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteHabit(habit.habitId)}
                          >
                            ✕
                          </button>

                        </div>
                      </>

                    )}

                  </div>
                ))}
              </div>

            </div>

            {/* WEEKS */}
            <div className="weeks-container">

              {calendar.map((week, wIndex) => (

                <div className={`week-card week-${wIndex}`} key={wIndex}>

                  <div className="week-title">
                    week {wIndex + 1}
                  </div>

                  {/* Days row */}
                  <div className="day-row">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="day-name">{d}</div>
                    ))}
                  </div>

                  {/* Dates row */}
                  <div className="date-row">
                    {week.map((day, i) => (
                      <div key={i} className="date-box">
                        {day || ""}
                      </div>
                    ))}
                  </div>

                  {/* Habit rows */}
                  {monthData?.habits.map(habit => (

                    <div className="habit-row" key={habit.habitId}>

                      {week.map((day, i) => {

                        const today = new Date();

                        const clickedDate = new Date(
                          selectedYear,
                          selectedMonth - 1,
                          day
                        );

                        const isToday =
                          day === today.getDate() &&
                          selectedMonth === today.getMonth() + 1 &&
                          selectedYear === today.getFullYear();

                        const isFuture = clickedDate > today;

                        if (!day) return <div key={i} className="empty"></div>

                        const done = habit?.dailyStatus?.[day]

                        return (
                          <div
                            key={day}
                            className={`box week-${wIndex}
                              ${done ? "done" : ""}
                              ${isToday ? "today-box" : ""}
                              ${isFuture ? "future-box" : ""}
                            `}
                            onClick={() => !isFuture && toggleHabit(habit.habitId, day)}
                          />
                        )

                      })}

                    </div>

                  ))}

                </div>

              ))}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;