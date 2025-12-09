import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// Kamu bisa ganti ini dengan icon dari library seperti react-icons atau asset SVG kamu
const UserIcon = () => <span style={{fontSize: '24px', marginRight: '8px'}}>👥</span>;
const StarIcon = () => <span style={{fontSize: '24px', marginRight: '8px'}}>⭐</span>;
const TargetIcon = () => <span style={{fontSize: '24px', marginRight: '8px'}}>🎯</span>;

export const LandingPage = () => {
  const navigate = useNavigate();

  // Logic 1: Tombol "Start Free Assessment" -> Login -> Psikotes
  const handleStartAssessment = () => {
    navigate('/login', { state: { redirectPath: '/psikotes' } });
  };

  // Logic 2: Tombol "Get Started" (Navbar) -> Login -> Home
  const handleGetStarted = () => {
    navigate('/login', { state: { redirectPath: '/home' } });
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">
           {/* Ganti dengan <img src={logo} /> jika ada */}
           ASAH
        </div>
        <button className="btn-get-started" onClick={handleGetStarted}>
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="badge-pill">
          ✨ AI-Powered Career Guidance
        </div>

        <h1 className="hero-title-landing">
          Find Your Perfect<br />
          <span className="hero-highlight">Career Path</span>
        </h1>

        <p className="hero-subtitle">
          Take fun personality tests and get a personalized learning roadmap<br />
          tailored just for you
        </p>

        <div className="cta-buttons">
          <button className="btn-primary" onClick={handleStartAssessment}>
            Start Free Assessment
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-container">
          <div className="stat-item">
            <UserIcon />
            <div className="stat-text">
              <strong>10,000+</strong>
              <span>Happy Users</span>
            </div>
          </div>

          <div className="stat-item">
            <StarIcon />
            <div className="stat-text">
              <strong>4.9/5</strong>
              <span>Rating</span>
            </div>
          </div>

          <div className="stat-item">
            <TargetIcon />
            <div className="stat-text">
              <strong>50+</strong>
              <span>Career Paths</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};