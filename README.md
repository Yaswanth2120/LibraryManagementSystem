# 📚 LibriSys - Library Management System

LibriSys is a full-stack Library Management System built with **Node.js, Express.js, Sequelize, MySQL**, and **React + Vite**.  
It supports **Students, Librarians, and Admins** with secure role-based dashboards.

---

## 🚀 Features

- ✅ User Authentication (JWT + Bcrypt)
- 🔐 Role-based Dashboards:
  - Student: Browse & request books, view history
  - Librarian: Approve/Reject borrow requests
  - Admin: Manage books (CRUD), View reports
- 📚 Book Management (Add, Edit, Delete)
- 📨 Borrow Request System
- 📊 Admin Reports:
  - Most Borrowed Book
  - Most Active Borrower
- 🌐 API protection using JWT tokens
- 💾 Sequelize ORM + MySQL Database
- ⚙️ Vite + Tailwind CSS Frontend

---

## 🛠 Tech Stack

| Category    | Tech Used                                 |
|-------------|-------------------------------------------|
| Backend     | Node.js, Express.js, Sequelize, MySQL     |
| Frontend    | React, Vite, Tailwind CSS                 |
| Authentication | JWT, bcryptjs                        |
| Dev Tools   | ESLint, Nodemon, Prettier                 |

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/your-username/libriSys.git
cd libriSys
```
## 2️⃣ Setup Backend (lms-backend)

```bash
cd lms-backend
npm install
```

Create a .env file inside lms-backend/ folder:

```env
DB_NAME=libriSys_DB
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
PORT=5000
```
Setup Database:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```
Start Backend Server:
```bash
npm run dev
```
Backend running at: http://localhost:5000

## 3️⃣ Setup Frontend (lms-frontend)
```bash
cd ../lms-frontend
npm install
npm run dev
```
Frontend running at: http://localhost:5173

## 🔐 Role Assignment During Registration
| Email Format | Role Assigned |
|--------------|---------------|
| Ends with `@student.com`    | student |
| Ends with `@librarian.com`  | librarian |
| Ends with `@admin.com`      | admin |
| Any other email (`@gmail.com`, etc.) | student |

## 🧪 Sample Users
| Name          | Email                  | Password     | Role      |
|---------------|-------------------------|--------------|-----------|
| Student A     | stud1@student.com        | student123   | Student   |
| Librarian One | lib1@librarian.com        | librarian123 | Librarian |
| Admin One     | admin1@admin.com          | admin123     | Admin     |

## 💡 Future Enhancements
🌙 Dark Mode Toggle (In progress)

📈 Analytics Dashboard

📤 Email Notifications for Borrow Reminders

## Made with ❤️ by Yaswanth 🚀