import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { authService } from '../services/authService';
import ASAH from "../assets/ASAH.svg";
import './Header.css';

export const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  {/* Logout Functionality 
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };*/}

  const goToDashboard = () => {
    navigate('/roadmap');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section" onClick={goToDashboard}>
          <img src={ASAH} alt="ASAH Logo" className="logo-image" />
        </div>

        {/* Right Section */}
        <div className="right-section">
          {user && (
            <>
              {/* Dashboard Link */}

              <NavLink 
                to="/roadmap"
                className={({ isActive }) => `dashboard-link ${isActive ? 'active' : ''}`}
              >
                Course
              </NavLink>

              {/* User Profile */}
              <div className="profile-section">
                <button className="profile-image" type="button" onClick={goToProfile} aria-label="Buka profil">
                  <img 
                    src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=E8F4F8&color=2C5F6F&size=40`}
                    alt="Profile"
                  />
                </button>
              </div>

              {/* Logout Button (optional) 
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>*/}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
