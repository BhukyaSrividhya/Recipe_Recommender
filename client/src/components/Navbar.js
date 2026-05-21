// client/src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ● Show username initial ONLY when isLoggedIn === true
  const username = isLoggedIn ? localStorage.getItem("username") : "";
  const initial = username ? username.charAt(0).toUpperCase() : "";

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="nav-logo-link" onClick={closeMenus}>
            <img src="/logo.jpg" alt="Cozy Kitchen" className="nav-logo-image" />
            <span className="nav-logo">Cozy Kitchen</span>
          </Link>
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <div className="desktop-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/my-recipes" className="nav-link">My Recipes</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
              </div>

              <div className="profile-menu-container" ref={dropdownRef}>
                <div
                  className="profile-icon"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {initial}
                </div>

                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <button
                      onClick={() => {
                        onLogout();
                        closeMenus();
                      }}
                      className="nav-button-outline"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-button">Sign In</Link>
          )}

          {isLoggedIn && (
            <button
              className="menu-icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </nav>

      {isLoggedIn && isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="nav-link" onClick={closeMenus}>Home</Link>
          <Link to="/my-recipes" className="nav-link" onClick={closeMenus}>My Recipes</Link>
          <Link to="/favorites" className="nav-link" onClick={closeMenus}>Favorites</Link>
        </div>
      )}
    </>
  );
}

export default Navbar;