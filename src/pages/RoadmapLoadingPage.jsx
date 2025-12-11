import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoadmapLoadingPage.css';
// Import logo segitiga kamu (bisa pakai ASAH.svg atau icon lain)
// Jika tidak ada, saya pakai SVG inline di bawah

export const RoadmapLoadingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analisis hasil test",
    "Identifikasi kemampuan",
    "Memproses AI",
    "Membuat kurikulum",
    "Optimalisasi path",
    "Finalisasi roadmap"
  ];

  useEffect(() => {
    // Kecepatan antar step (1.5 detik per step)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    // Jika sudah mencapai step terakhir + buffer waktu, pindah halaman
    if (currentStep === steps.length) {
      setTimeout(() => {
        navigate('/roadmap'); // Pindah ke RoadmapPage (Final)
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [currentStep, navigate, steps.length]);

  // Hitung persentase progress bar
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="loading-page-wrapper">
      
      <div className="loading-content-container">
        {/* Central Icon (Triangle) */}
        <div className="central-icon">
          <img src="/AsahLogo.svg" alt="Logo" style={{ height: '200px' }} />
        </div>

        <h1 className="loading-title">Memproses Roadmap Kamu</h1>
        <p className="loading-subtitle">
          AI kami sedang membuat jalur pembelajaran yang sesuai dengan personal kamu!
        </p>

        <div className="progress-card">
          <p className="progress-label">Menganalisis hasil test kamu...</p>
          
          {/* Progress Bar */}
          <div className="progress-track">
            <div 
              className="progress-fill-bar" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Steps List */}
          <div className="steps-list">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div 
                  key={index} 
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="step-icon-box">
                    {isCompleted ? (
                      // Icon Centang (Completed)
                      <span className="icon-check">✓</span>
                    ) : (
                      // Icon Default (Icon Bulat simple)
                      <div className={`icon-circle ${isActive ? 'pulsing' : ''}`}>
                         {/* Icon placeholder simple */}
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                           <polyline points="14 2 14 8 20 8"></polyline>
                           <line x1="16" y1="13" x2="8" y2="13"></line>
                           <line x1="16" y1="17" x2="8" y2="17"></line>
                           <polyline points="10 9 9 9 8 9"></polyline>
                         </svg>
                      </div>
                    )}
                  </div>
                  <span className="step-text">{step}</span>
                  
                  {/* Animasi Spinner kecil jika sedang aktif */}
                  {isActive && <div className="mini-spinner"></div>}
                </div>
              );
            })}
          </div>

          {/* Fact Box */}
          <div className="fact-box">
            <strong>Tahukah kamu?</strong> Personalisasi jalur belajar dapat meningkatkan kecepatan penguasaan keterampilan hingga 60% dibandingkan metode tradisional.
          </div>
        </div>
      </div>
    </div>
  );
};