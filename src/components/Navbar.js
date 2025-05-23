import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      const storedImage = localStorage.getItem(`userImage_${user.id}`);
      if (storedImage) {
        setImageUrl(storedImage);
      }
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    const confirmed = window.confirm("Da li ste sigurni da se želite odjaviti?");
    if (confirmed) {
      alert("Uspješno ste se odjavili.");
      setShowDropdown(false);
      setShowMobileMenu(false);
      onLogout();
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate("/profile");
  };

  const handleMobileLinkClick = (path) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          📅Eventify
        </Link>
      </div>

      
      <div className="navbar-center">
        <Link to="/" className="navbar-link"><b>Home</b></Link>
        <Link to="/contact" className="navbar-link"><b>Contact</b></Link>
        <Link to="/events" className="navbar-link"><b>Events</b></Link>
        {isLoggedIn && user?.role === "admin" && (
          <>
            <Link to="/admin" className="navbar-link"><b>Admin</b></Link>
            <Link to="/admin-management" className="navbar-link"><b>User Management</b></Link>
          </>
        )}
      </div>

      
      <div className="navbar-right">
        {isLoggedIn && user ? (
          <div className="profile-wrapper" ref={dropdownRef}>
            <div
              className="profile-link"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {(imageUrl || user.profilnaSlika) ? (
                <img
                  src={imageUrl || user.profilnaSlika}
                  alt="Profilna"
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  {getInitials(user.name || `${user.ime} ${user.prezime}`)}
                </div>
              )}
              <b>{user.name || user.ime}</b>
            </div>
            <div className={`profile-dropdown ${showDropdown ? "show" : ""}`}>
              <button className="dropdown-item" onClick={handleProfileClick}>
                 Moj profil
              </button>
              <button className="dropdown-item" onClick={handleLogoutClick}>
                 Odjava
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="auth-link"><b>Login</b></Link>
            <Link to="/register" className="auth-link"><b>Register</b></Link>
          </>
        )}
      </div>

      
      <div className="mobile-hamburger-wrapper">
        <button
          className="hamburger-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
        </button>
      </div>

      
      <div className={`mobile-menu ${showMobileMenu ? 'open' : ''}`} ref={mobileMenuRef}>
        <div className="mobile-menu-content">
          
          {isLoggedIn && user && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                {(imageUrl || user.profilnaSlika) ? (
                  <img
                    src={imageUrl || user.profilnaSlika}
                    alt="Profilna"
                    className="mobile-profile-image"
                  />
                ) : (
                  <div className="mobile-profile-placeholder">
                    {getInitials(user.name || `${user.ime} ${user.prezime}`)}
                  </div>
                )}
                <div className="mobile-user-name">
                  <b>{user.name || user.ime}</b>
                </div>
                
                <div className="mobile-user-actions">
                  <button className="mobile-user-button profile" onClick={handleProfileClick}>
                     Moj profil
                  </button>
                  <button className="mobile-user-button logout" onClick={handleLogoutClick}>
                     Odjava
                  </button>
                </div>
              </div>
            </div>
          )}

          
          <div className="mobile-nav-links">
            <button 
              className="mobile-nav-item" 
              onClick={() => handleMobileLinkClick('/')}
            >
               Home
            </button>
            <button 
              className="mobile-nav-item" 
              onClick={() => handleMobileLinkClick('/contact')}
            >
               Contact
            </button>
            <button 
              className="mobile-nav-item" 
              onClick={() => handleMobileLinkClick('/events')}
            >
                Events
            </button>

            
            {isLoggedIn && user?.role === "admin" && (
              <>
                <button 
                  className="mobile-nav-item" 
                  onClick={() => handleMobileLinkClick('/admin')}
                >
                   Admin
                </button>
                <button 
                  className="mobile-nav-item" 
                  onClick={() => handleMobileLinkClick('/admin-management')}
                >
                   User Management
                </button>
              </>
            )}
          </div>

          
          {!isLoggedIn && (
            <div className="mobile-actions">
              <div className="mobile-divider"></div>
              <button 
                className="mobile-action-item" 
                onClick={() => handleMobileLinkClick('/login')}
              >
                 Login
              </button>
              <button 
                className="mobile-action-item" 
                onClick={() => handleMobileLinkClick('/register')}
              >
                 Register
              </button>
            </div>
          )}
        </div>

        
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setShowMobileMenu(false)}
        ></div>
      </div>
    </nav>
  );
};

export default Navbar;