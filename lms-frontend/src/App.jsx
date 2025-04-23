import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import BooksPage from "./pages/BooksPage.jsx"
import BorrowBooksPage from "./pages/student/BorrowBooksPage.jsx"
import MyRequestsPage from "./pages/student/MyRequestsPage.jsx"
import LibrarianRequestsPage from "./pages/librarian/LibrarianRequestsPage.jsx"
import StudentDashboard from "./pages/student/StudentDashboard.jsx"
import LibrarianDashboard from "./pages/librarian/LibrarianDashboard.jsx"
import Navbar from "./components/Navbar.jsx"

import PrivateRoute from "./routes/PrivateRoute.jsx"
import RoleRoute from "./routes/RoleRoute.jsx"

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <BooksPage />
              </PrivateRoute>
            }
          />

          {/* STUDENT ROUTES */}
          <Route
            path="/student/dashboard"
            element={
              <RoleRoute allowed={["student"]}>
                <StudentDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/student/borrow"
            element={
              <RoleRoute allowed={["student"]}>
                <BorrowBooksPage />
              </RoleRoute>
            }
          />
          <Route
            path="/student/requests"
            element={
              <RoleRoute allowed={["student"]}>
                <MyRequestsPage />
              </RoleRoute>
            }
          />

          {/* LIBRARIAN ROUTES */}
          <Route
            path="/librarian/requests"
            element={
              <RoleRoute allowed={["librarian", "admin"]}>
                <LibrarianRequestsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/librarian/dashboard"
            element={
              <RoleRoute allowed={["librarian", "admin"]}>
                <LibrarianDashboard />
              </RoleRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
