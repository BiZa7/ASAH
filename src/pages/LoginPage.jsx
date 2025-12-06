import ASAH from "../assets/ASAH.svg";
import google_icon from "../assets/google_icon.svg";
import copyright from "../assets/copyright.svg";
import instagram from "../assets/instagram.svg";
import linkedin from "../assets/linkedin.svg";
import mail from "../assets/mail.svg";
import globe from "../assets/globe.svg";
import Ocean from "../assets/Ocean.svg";
import PsychologyTest from "../assets/PsychologyTest.svg";
import Roadmap from "../assets/Roadmap.svg";

import './LoginPage.css'

export function LoginPage() {
  const handleGoogleLogin = () => {
    console.log("Login with Google");
  };
  
  const handleGoogleSignup = () => {
    console.log("Sign up with Google");
  };
  
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="login-card">
          <h1 className="welcome-text">Selamat Datang di</h1>
          <div className="logo-container">
            <img src={ASAH} alt="Logo ASAH" />
          </div>
          <h4 className="text-asisten">Asisten Sahabat Keahlian</h4>
          <div className="mid-login-card">
            <p className="login-text">Silakan Login untuk melanjutkan</p>
            <button className="login-button" onClick={handleGoogleLogin}>
              <img src={google_icon} alt="Google Icon" className="google-icon" />
              Lanjutkan dengan Google
            </button>
            <p className="login-text">
              Belum punya akun? {" "}
              <span className="signup-link" onClick={handleGoogleSignup}>
                Sign Up
              </span>
            </p>
          </div>
          <p className="copyright-text">© 2025 ASAH Inc. All rights reserved</p>
        </div>
        
        <div className='hero-container'>
          <h2 className="hero-title">
            Temukan keahlianmu bersama <span className="highlight">ASAH</span>!
          </h2>
          <p className="hero-description">
            ASAH menggunakan AI dan asesmen psikologis untuk menciptakan roadmap pembelajaran personal yang disesuaikan dengan keterampilan dan kepribadian unik Anda. Mulailah perjalanan Anda menuju profesional hari ini.
          </p>
          
          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">
                <img className="footer-icon" src={Ocean} />
              </div>
              <div className="feature-text">
                <p className="feature-title">OCEAN Test</p>
                <p className="feature-subtitle">Analisis Kepribadian</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img className="footer-icon" src={PsychologyTest} />
              </div>
              <div className="feature-text">
                <p className="feature-title">Aptitude Test</p>
                <p className="feature-subtitle">Tes Kemampuan</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img className="footer-icon" src={Roadmap} />
              </div>
              <div className="feature-text">
                <p className="feature-title">AI Roadmap</p>
                <p className="feature-subtitle">Personalisasi Alur Belajar</p>
              </div>
            </div>
          </div>
          
          <div className="hero-users">
            <div className="user-avatars">
              {/* Ganti dengan avatar user asli atau gunakan placeholder */}
              <img src="https://i.pravatar.cc/150?img=1" alt="User 1" />
              <img src="https://i.pravatar.cc/150?img=2" alt="User 2" />
              <img src="https://i.pravatar.cc/150?img=3" alt="User 3" />
              <img src="https://i.pravatar.cc/150?img=4" alt="User 4" />
            </div>
            <p className="user-count">Dipercaya oleh 1000+ pengguna</p>
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-links">
          <a href="#" className="footer-link">
            <img className="footer-icon" src={copyright} />
            2025 ASAH Inc. All rights reserved</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={instagram} />
             asahkarir</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={linkedin} />
            asahkarir</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={mail} />
            asahkarir@example.com</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={globe} />
            www.asahkarir.com</a>
        </div>
      </footer>
    </div>
  );
}