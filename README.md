# 🚀 Smart Complaint & Grievance Management System

> **Report. Track. Resolve.**

The **Smart Complaint & Grievance Management System** is a web-based platform designed to make complaint management easier, faster, and more transparent within educational institutions.

Students can raise complaints, track their progress, and receive updates, while administrators can manage complaints, update statuses, monitor recurring issues, and analyze grievance data through a centralized dashboard.

---

## 🌟 Features

### 👨‍🎓 Student Portal
- 🔐 Secure student login
- 📝 Raise a new complaint
- 🆔 Automatically generated complaint ID
- 📋 View submitted complaints
- 🔍 Track complaint status
- 🔔 Receive notifications when complaints are resolved

### 👨‍💼 Admin Portal
- 🔐 Secure administrator login
- 📊 Dashboard with complaint statistics
- 📋 View all complaints
- 🔄 Update complaint status
- ⚡ Identify repeated complaints and increase priority
- 📈 Complaint analytics and insights
- 🗂️ Centralized complaint management

### 🔒 Security
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access
- Protected API routes
- Environment variables for sensitive credentials

---

## 🔄 Complaint Workflow

```text
Student
   │
   ▼
Login
   │
   ▼
Raise Complaint
   │
   ▼
Complaint ID Generated
   │
   ▼
Submitted
   │
   ▼
In Process
   │
   ▼
Resolved
   │
   ▼
Student Receives Update
```

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt.js

### Additional Technologies
- Socket.IO for real-time communication
- Email notifications
- Cloudinary for file/image management

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Students       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       + Vite        │
                    └──────────┬──────────┘
                               │
                         REST API / Socket
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │     MongoDB     │        │  Notifications  │
        │     Database    │        │     / Email     │
        └─────────────────┘        └─────────────────┘
```

---

## 📂 Project Structure

```text
smart-grievance-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-grievance-system.git
```

### 2. Open the project

```bash
cd smart-grievance-system
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=your_frontend_url

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ **Never upload your `.env` file or expose your database credentials, JWT secret, email password, or API keys on GitHub.**

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 👤 User ID Format

The system uses User IDs to identify the portal.

| Prefix | Portal |
|--------|--------|
| `STU` | Student Portal |
| `ADM` | Admin Portal |

Example:

```text
STU1002
ADM1001
```

---

## 📊 Complaint Status

A complaint moves through different stages:

| Status | Meaning |
|--------|---------|
| 🟡 Submitted | Complaint has been received |
| 🔵 In Process | Administrator is working on the issue |
| 🟢 Resolved | Complaint has been completed |

---

## 💡 Key Benefits

- ✅ Simple complaint submission
- ✅ Transparent complaint tracking
- ✅ Faster grievance resolution
- ✅ Centralized administration
- ✅ Real-time status updates
- ✅ Email notifications
- ✅ Data-driven complaint analysis
- ✅ Helps identify recurring institutional problems
- ✅ Improves communication between students and administrators

---

## 🎯 Project Objective

The main objective of this project is to replace traditional manual complaint processes with a **digital, transparent, and efficient grievance management system**.

It helps institutions understand student concerns and provides students with a convenient way to monitor the progress of their complaints.

---

## 🔮 Future Enhancements

- 🤖 AI-powered complaint categorization
- 🧠 Automatic priority prediction
- 📱 Mobile application
- 🌐 Multilingual support
- 📊 Advanced analytics
- 🔔 Push notifications
- 💬 AI chatbot for complaint assistance
- 📍 Location-based complaint reporting

---

## 📸 Screenshots

Add screenshots of your project here:

```text
### Landing Page
![Landing Page](screenshots/home.png)

### Student Dashboard
![Student Dashboard](screenshots/student-dashboard.png)

### Raise Complaint
![Raise Complaint](screenshots/raise-complaint.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## 👩‍💻 Developer

### **Sudharsanaa G**

**Project:** Smart Complaint & Grievance Management System

**Domain:** Full Stack Web Development

**Technologies:** React.js • Node.js • Express.js • MongoDB

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ **Star** on GitHub.

---

## 📄 License

This project is developed for educational and project demonstration purposes.
