import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import AdminManagement from "./pages/AdminManagement";
import EventRegistration from "./pages/EventRegistration";
import Profile from "./pages/Profile";

import "./styles/Navbar.css";
import "./styles/Footer.css";
import "./styles/Home.css";
import "./styles/Events.css";
import "./styles/Register.css";
import "./styles/Login.css";
import "./styles/Contact.css";
import "./styles/AdminPanel.css";
import "./styles/AdminManagement.css";
import "./styles/EventRegistration.css";
import "./styles/Profile.css";

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleRegister = () => {
    const newUser = { email: "newuser@example.com", role: "user" };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  return (
    <div className="page-wrapper">
      <Navbar isLoggedIn={!!user} user={user} onLogout={handleLogout} />

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dws-main" element={<Navigate to="/" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          {user?.role === "admin" && (
            <>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin-management" element={<AdminManagement />} />
            </>
          )}
          {user && (
            <Route
              path="/profile"
              element={<Profile user={user} onUserUpdate={handleUserUpdate} onLogout={handleLogout} />}
            />
          )}
          <Route path="/event-registration/:eventId" element={<EventRegistration />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;