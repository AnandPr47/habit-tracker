# Habit Tracker App

A full-stack **MERN Habit Tracker** application to track daily habits, monitor monthly progress, and maintain consistency using a calendar-based tracking system.

## Features Implemented

### Authentication

* User Registration
* User Login using JWT Authentication
* Protected Dashboard Access
* Password hashing using bcrypt

### Habit Management

* Add new habits
* Edit habit names
* Delete habits
* Prevent duplicate habits
* Instant habit update without page refresh

### Calendar Tracking

* Monthly calendar view
* Track daily habit completion
* Current day highlight
* Future dates disabled
* Month switching (Previous / Next)
* Dynamic month-based habit tracking

### Analytics

* Monthly completion percentage
* Habit streak tracking
* Progress percentage per habit

### Smart Restrictions

* Cannot navigate to future months
* Month navigation starts from user join month
* User join date displayed on dashboard

## Tech Stack

### Frontend

* React (Vite)
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## Project Structure

```text
habit-tracker/
│── backend/
│── frontend/
```

## Installation

### Clone Repository

```bash
git clone <your-repo-link>
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Future Improvements

* Email verification
* Responsive mobile UI
* Better dashboard design
* Analytics graphs
* Habit reminder system
* Dark mode
* Streak rewards / achievements

## Current Status

Project is under active development 🚀
