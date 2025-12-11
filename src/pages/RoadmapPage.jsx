import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './RoadmapPage.css'; 
import { 
  ChartColumn, 
  BarChart3, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  X,
  BookOpen,
  CheckCircle2,
  Lock,
  Check // Saya ganti CheckLine (biasanya tidak ada di lucide standar) ke Check/CheckCircle2
} from 'lucide-react';

export const RoadmapPage = () => {
  const navigate = useNavigate(); // 2. Inisialisasi navigate
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [selectedSubModule, setSelectedSubModule] = useState(null);

  // ... (Data Mockup roadmapData TETAP SAMA, tidak perlu diubah) ...
  const roadmapData = [
    { 
      id: 1, 
      title: "Fundamental Data Analyst", 
      duration: "7 hari",
      subModules: [
        {
          id: 101,
          title: "Fundamental & Basic Excel",
          description: "Menguasai manipulasi data, formula, dan pivot tables",
          tags: ["MS. Excel Tutorial", "Excel for Data Science"],
          status: "available",
          details: {
            duration: "2 Jam",
            topics: ["Pengenalan Excel", "Konsep Excel", "Teknologi dasar", "Excel untuk industri"]
          }
        },
        {
          id: 102,
          title: "Dasar Statistika",
          description: "Belajar statistik deskriptif, probabilitas, dan distribusi.",
          tags: ["Western Statistic", "Statistic for Data Science"],
          status: "locked",
          details: {
            duration: "3 Jam",
            topics: ["Mean, Median, Mode", "Standard Deviation"]
          }
        }
      ]
    },
    { 
      id: 2, 
      title: "SQL untuk Pemula", 
      duration: "5 hari",
      subModules: [
        {
          id: 201,
          title: "Pengenalan Database",
          description: "Memahami struktur database relasional.",
          tags: ["SQL Basics"],
          status: "locked",
          details: {
            duration: "1.5 Jam",
            topics: ["Apa itu RDBMS", "Primary Key vs Foreign Key"]
          }
        }
      ]
    },
    { id: 3, title: "Pengenalan Python", duration: "10 hari", subModules: [] },
    { id: 4, title: "Visualisasi Data", duration: "7 hari", subModules: [] },
  ];

  const toggleModule = (id) => {
    if (expandedModuleId === id) setExpandedModuleId(null);
    else setExpandedModuleId(id);
  };

  const openModal = (subModule) => setSelectedSubModule(subModule);
  const closeModal = () => setSelectedSubModule(null);

  // 3. Fungsi Navigasi ke Modul Page
  const handleStartLearning = () => {
    // Opsional: Anda bisa mengirim ID modul jika halaman modulnya dinamis
    // navigate(`/modul/${selectedSubModule.id}`);
    
    navigate('/modul'); 
  };

  return (
    <div className="roadmap-page-wrapper">
      <div className="roadmap-content-container">
        
        {/* Header */}
        <div className="roadmap-header">
          <div className="header-icon-box">
            <ChartColumn color="#0B4251" size={28} />
          </div>
          <div className="header-text-box">
            <h1 className="header-title">Beranda Pembelajaran Kamu</h1>
            <p className="header-subtitle">Data Analyst Career Path</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-card-roadmap">
          <div className="progress-info">
            <div>
              <h2 className="progress-title">Progres Keseluruhan</h2>
              <p className="progress-subtitle">0 dari 12 milestone selesai</p>
            </div>
            <div className="progress-percentage-box">
              <span className="percentage-text">0%</span>
              <span className="percentage-label">Selesai</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Modules List */}
        <div className="modules-list">
          {roadmapData.map((module) => {
            const isExpanded = expandedModuleId === module.id;

            return (
              <div key={module.id} className="module-wrapper">
                <div 
                  className={`module-card ${isExpanded ? 'active' : ''}`} 
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="module-icon-box">
                    <BarChart3 color="#FFFFFF" size={24} />
                  </div>
                  <div className="module-info">
                    <h3 className="module-title">{module.title}</h3>
                    <div className="module-meta">
                      <Clock size={14} />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  <div className="module-action">
                    {isExpanded ? <ChevronUp color="#0B4251" size={20} /> : <ChevronDown color="#0B4251" size={20} />}
                  </div>
                </div>

                {isExpanded && module.subModules.length > 0 && (
                  <div className="sub-modules-container">
                    {module.subModules.map((sub, index) => {
                      const isLocked = sub.status === 'locked';

                      return (
                        <div key={sub.id} className={`sub-module-card ${isLocked ? 'locked-card' : ''}`}>
                          
                          <div className="sub-module-number">
                            {index + 1}
                          </div>

                          <div className="sub-module-content">
                            <div className="sub-header">
                              <h4 className="sub-title">{sub.title}</h4>
                              {isLocked ? (
                                <span className="badge-gray">Locked</span>
                              ) : (
                                <span className="badge-yellow">Available</span>
                              )}
                            </div>
                            
                            <p className="sub-desc">{sub.description}</p>
                            
                            <div className="sub-tags">
                              <span className="tag-label">REKOMENDASI SUMBER</span>
                              <div className="tags-row">
                                {sub.tags.map((tag, idx) => (
                                  <span key={idx} className="source-tag">
                                    <BookOpen size={10} style={{marginRight:4}}/> 
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button 
                            className={`btn-arrow-action ${isLocked ? 'btn-locked' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isLocked) openModal(sub);
                            }}
                            disabled={isLocked}
                          >
                            {isLocked ? (
                              <Lock size={18} color="#9CA3AF" />
                            ) : (
                              <ArrowRight size={20} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {selectedSubModule && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedSubModule.title}</h2>
              <button className="btn-close" onClick={closeModal}><X size={24} /></button>
            </div>

            <p className="modal-desc">
              {selectedSubModule.description}
            </p>

            <div className="modal-badge-row">
              <div className="duration-badge">
                <Clock size={16} />
                <span>Durasi: {selectedSubModule.details.duration}</span>
              </div>
            </div>

            <div className="modal-learning-section">
              <h3>Yang akan kamu pelajari</h3>
              <ul className="learning-list">
                {selectedSubModule.details.topics.map((topic, idx) => (
                  <li key={idx}>
                    {/* Menggunakan CheckCircle2 atau Check */}
                    <CheckCircle2 size={18} color="#22C55E" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Update Button dengan onClick Handler */}
            <button className="btn-start-learning" onClick={handleStartLearning}>
              Mulai Belajar <ArrowRight size={18} />
            </button>

          </div>
        </div>
      )}
    </div>
  );
};