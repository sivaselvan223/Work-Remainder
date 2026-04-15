# ⏰ WorkReminder — Task & Reminder Management App

A full-stack **MERN** application for managing tasks and receiving real-time reminders. Built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 🚀 Features

- **🔐 JWT Authentication** — Secure register/login with encrypted passwords
- **📝 Task CRUD** — Create, read, update, and delete tasks
- **⏰ Real-Time Reminders** — Socket.io pushes instant notifications when tasks are due
- **🔄 Recurring Tasks** — Set daily, weekly, or monthly recurrence
- **📅 Calendar View** — Visual calendar with color-coded task indicators
- **📊 Dashboard Stats** — Track total, pending, completed, and overdue tasks
- **🌗 Dark/Light Theme** — Toggle with persistent preference
- **🔔 Browser Push Notifications** — Native alerts when tasks are due
- **📱 Responsive Design** — Mobile-first glassmorphism UI
- **📧 Email Notifications** — Optional SMTP-based email reminders

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (React + Vite)             │
│           http://localhost:5173             │
│                                             │
│   • React Router — SPA navigation          │
│   • Tailwind CSS — Styling & dark mode     │
│   • Socket.io Client — Real-time events    │
│   • Axios — HTTP requests with JWT         │
│   • Lucide React — Icon library            │
└──────────────────┬──────────────────────────┘
                   │ REST API + WebSocket
┌──────────────────▼──────────────────────────┐
│         Backend (Express + Node.js)         │
│           http://localhost:5000             │
│                                             │
│   • JWT — Token-based authentication       │
│   • Socket.io Server — Real-time push      │
│   • Node-cron — Scheduled task checks      │
│   • Nodemailer — Email notifications       │
│   • Mongoose — MongoDB ODM                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              MongoDB Database               │
│         work-reminder (localhost)            │
│                                             │
│   Collections: users, tasks                 │
└─────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
work-reminder/
├── client/                    # React Frontend
│   ├── public/
│   │   └── sw.js              # Service worker for notifications
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarView.jsx    # Monthly calendar with task dots
│   │   │   ├── Navbar.jsx          # Top nav with theme toggle & notifications
│   │   │   ├── ProtectedRoute.jsx  # Auth guard for routes
│   │   │   ├── TaskCard.jsx        # Individual task display
│   │   │   ├── TaskForm.jsx        # Create/Edit task modal
│   │   │   └── TaskList.jsx        # Grouped task list (overdue/pending/done)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Authentication state management
│   │   │   └── ThemeContext.jsx    # Dark/Light theme management
│   │   ├── hooks/
│   │   │   ├── useSocket.js        # Socket.io connection hook
│   │   │   └── useTasks.js         # Tasks CRUD + filtering hook
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard with stats & tasks
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx        # Registration page
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with JWT interceptor
│   │   ├── utils/
│   │   │   └── notifications.js    # Browser notification helpers
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles & Tailwind config
│   ├── index.html
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   └── taskController.js   # CRUD + Stats + Toggle complete
│   ├── middlewares/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── Task.js             # Task schema (title, datetime, status, recurrence)
│   │   └── User.js             # User schema (name, email, hashed password)
│   ├── routes/
│   │   ├── auth.js             # /api/auth routes
│   │   └── tasks.js            # /api/tasks routes
│   ├── services/
│   │   ├── emailService.js     # Nodemailer SMTP email sender
│   │   ├── scheduler.js        # Node-cron job for reminders
│   │   └── socketService.js    # Socket.io initialization & auth
│   ├── server.js               # Express app entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** — Running locally on `mongodb://localhost:27017` or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sivaselvan223/Activity-checker.git
cd Activity-checker
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/work-reminder
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Optional: Email notifications (Gmail SMTP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# SMTP_FROM=your-email@gmail.com
```

### 3. Setup the Client

```bash
cd ../client
npm install
```

### 4. Run the Application

**Start the server** (from `/server`):
```bash
npm run dev
```

**Start the client** (from `/client` in a new terminal):
```bash
npm run dev
```

### 5. Open in Browser

Navigate to **http://localhost:5173** and create an account to get started!

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and get JWT | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/tasks` | Get all user tasks (with filters) | ✅ |
| `GET` | `/api/tasks/stats` | Get task statistics | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/api/tasks/:id` | Update a task | ✅ |
| `PATCH` | `/api/tasks/:id/complete` | Toggle task completion | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete a task | ✅ |

### Query Parameters (GET /api/tasks)

| Param | Values | Description |
|-------|--------|-------------|
| `filter` | `today`, `tomorrow`, `week` | Time-based filter |
| `status` | `pending`, `completed`, `overdue` | Status filter |
| `date` | `YYYY-MM-DD` | Specific date filter |

---

## 🔔 Real-Time Events (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `task:created` | Server → Client | New task created |
| `task:updated` | Server → Client | Task updated |
| `task:deleted` | Server → Client | Task deleted |
| `task:reminder` | Server → Client | Task is due — triggers notification |

---

## 🛡️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v7 |
| **State** | React Context API, Custom Hooks |
| **UI** | Lucide React Icons, React Hot Toast, Glassmorphism |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Real-Time** | Socket.io (server + client) |
| **Scheduler** | Node-cron (checks every 30 seconds) |
| **Email** | Nodemailer (optional SMTP) |

---

## 📸 Screenshots

### Login Page
- Clean glassmorphism design with animated background orbs
- Dark/Light theme support

### Dashboard
- Stats cards showing total, pending, completed, and overdue tasks
- Filterable task list grouped by status
- Interactive calendar view sidebar
- Completion rate progress bar

### Task Management
- Modal form for creating/editing tasks
- Date, time, and recurrence selection
- One-click complete toggle
- Hover-to-reveal edit/delete actions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using the MERN Stack
</p>
