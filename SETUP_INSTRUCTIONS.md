# 🚀 Quick Setup Guide for Group Members

## Prerequisites
- Node.js installed (https://nodejs.org)
- Git installed

---

## Option 1: Automatic Setup (Windows)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tbcombs04-hue/SDEV_255_Final_Project_Group.git
   cd SDEV_255_Final_Project_Group
   ```

2. **Run the setup script:**
   - Double-click `setup.bat` in the project folder
   - OR open PowerShell and run: `.\setup.bat`

3. **Start the servers:**
   - Double-click `start-servers.bat`
   - OR run manually (see Option 2)

---

## Option 2: Manual Setup

### Step 1: Install Dependencies

Open TWO terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
npm install
```

### Step 2: Create Backend Environment File

Create a file called `.env` in the `backend` folder with this content:

```
PORT=5000
MONGODB_URI=mongodb+srv://apullum3_db_user:Ryker0129@aubriedrinwalter.tnwddos.mongodb.net/course_management?retryWrites=true
JWT_SECRET=super_secret_jwt_key_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 3: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🌐 Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 👤 Test User Accounts

| Role    | Email              | Password     |
|---------|-------------------|--------------|
| Teacher | teacher@test.com  | password123  |
| Student | student@test.com  | password123  |

---

## ✨ Features by Role

### Teacher Can:
- View all courses
- Add new courses
- Edit courses
- Delete courses

### Student Can:
- View all courses (read-only)
- Cannot add/edit/delete courses

---

## 🛠️ Troubleshooting

### "MongoDB connection failed"
- Make sure you have internet connection
- The shared MongoDB Atlas cluster should work for everyone

### "Port already in use"
- Kill the process using the port, or change the port in `.env`

### "npm install fails"
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

---

## 📁 Project Structure

```
SDEV_255_Final_Project_Group/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Auth middleware (protect & authorize)
│   ├── models/         # User, Course, Enrollment models
│   ├── routes/         # API routes
│   ├── utils/          # JWT token utilities
│   └── server.js       # Express server
├── src/
│   ├── components/     # React components (Navbar)
│   ├── pages/          # React pages (Home, Login, Courses, AddCourse)
│   ├── App.jsx         # Main app with routing
│   └── main.jsx        # Entry point
└── package.json        # Frontend dependencies
```

