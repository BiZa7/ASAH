import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. Tambah useLocation
import { authService } from '../services/authService';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // 2. Inisialisasi useLocation

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setError(null);
      
      try {
        // Kirim authorization code ke backend
        const data = await authService.googleLogin(codeResponse.code);
        
        // Simpan tokens dan user data
        authService.saveTokens(data.accessToken, data.refreshToken);
        authService.saveUser(data.user);
        
        console.log('Login berhasil:', data.user);

        // 3. LOGIC REDIRECT DINAMIS DI SINI
        // Cek apakah ada request redirect dari Landing Page?
        // Jika tidak ada (null/undefined), default ke '/home'
        const destination = location.state?.redirectPath || '/home';
        
        navigate(destination); 
        
      } catch (err) {
        console.error('Login error:', err);
        setError(err.message || 'Login gagal. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth Error:', error);
      setError('Login gagal. Silakan coba lagi.');
    },
    flow: 'auth-code',
  });
  
  const handleGoogleSignup = () => {
    handleGoogleLogin();
  };
  
  // ... (Sisa kode JSX return tetap sama, tidak ada perubahan tampilan)
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
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <button 
              className="login-button" 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img src={google_icon} alt="Google Icon" className="google-icon" />
              {loading ? 'Memproses...' : 'Lanjutkan dengan Google'}
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
                <img className="footer-icon" src={Ocean} alt="Ocean" />
              </div>
              <div className="feature-text">
                <p className="feature-title">OCEAN Test</p>
                <p className="feature-subtitle">Analisis Kepribadian</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img className="footer-icon" src={PsychologyTest} alt="Psychology" />
              </div>
              <div className="feature-text">
                <p className="feature-title">Aptitude Test</p>
                <p className="feature-subtitle">Tes Kemampuan</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img className="footer-icon" src={Roadmap} alt="Roadmap" />
              </div>
              <div className="feature-text">
                <p className="feature-title">AI Roadmap</p>
                <p className="feature-subtitle">Personalisasi Alur Belajar</p>
              </div>
            </div>
          </div>
          
          <div className="hero-users">
            <div className="user-avatars">
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
            <img className="footer-icon" src={copyright} alt="Copyright" />
            2025 ASAH Inc. All rights reserved</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={instagram} alt="Instagram" />
             asahkarir</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={linkedin} alt="LinkedIn" />
            asahkarir</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={mail} alt="Email" />
            asahkarir@example.com</a>
          <a href="#" className="footer-link">
            <img className="footer-icon" src={globe} alt="Website" />
            www.asahkarir.com</a>
        </div>
      </footer>
    </div>
  );
}