// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContent";
import Login from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { Navbar } from "./components/Navbar";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {/* Show Navbar only if logged in */}
      {user && <Navbar />}
        <Routes>
          {/* Redirect logged-in users from /login */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

          {/* Role-based dashboard */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <EmployeeDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
