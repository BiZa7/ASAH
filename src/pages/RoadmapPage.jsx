import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { optionCareer } from '../services/roadmapService'; // Sesuaikan path import
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
  Lock
} from 'lucide-react';

export const RoadmapPage = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [roadmapData, setRoadmapData] = useState([]); // Data yang sudah dikelompokkan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [selectedSubModule, setSelectedSubModule] = useState(null);

  // --- FETCHING DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Kirim string kosong "" agar backend (ilike '%%') mengembalikan SEMUA materi user
        const response = await optionCareer.getMaterialUser("");

        if (response && response.data) {
          // Lakukan pengelompokan data berdasarkan Phase
          const groupedData = processBackendData(response.data);
          setRoadmapData(groupedData);
        } else {
          setRoadmapData([]);
        }
      } catch (err) {
        console.error("Error loading roadmap:", err);
        setError("Gagal memuat materi roadmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- LOGIC: DATA TRANSFORMATION ---
  // Mengubah Flat List dari DB menjadi Hierarchical List untuk UI
  const processBackendData = (items) => {
    const groups = {};

    // 1. Grouping by Phase Name
    items.forEach((item) => {
      const phaseName = item.phase || "Uncategorized"; // Fallback jika phase null
      
      if (!groups[phaseName]) {
        groups[phaseName] = {
          id: Object.keys(groups).length + 1, // Generate ID untuk Phase
          title: phaseName,
          duration: "Estimasi 1-2 Minggu", // Placeholder (Data durasi tidak ada di item)
          subModules: []
        };
      }

      // 2. Mapping field DB ke field UI
      // DB: judul, materi -> UI: title, description, details
      groups[phaseName].subModules.push({
        id: item.id,
        title: item.judul,
        description: item.materi ? item.materi.substring(0, 80) + "..." : "Pelajari materi ini.", // Preview text
        tags: ["Materi Utama"], // Default tag
        status: "available", // Default status (bisa disesuaikan logic-nya)
        fullMateri: item.materi, // Simpan materi lengkap untuk modal
        details: {
          duration: "30-60 Menit",
          topics: extractTopics(item.materi) // Helper untuk bikin bullet points dari teks materi
        }
      });
    });

    // Convert Object values ke Array agar bisa di-map
    return Object.values(groups);
  };

  // Helper sederhana untuk memecah teks materi jadi poin-poin (jika ada format markdown/list)
  const extractTopics = (text) => {
    if (!text) return ["Konsep Dasar", "Implementasi"];
    // Coba split berdasarkan baris baru atau bullet points
    return text.split('\n').filter(line => line.length > 5).slice(0, 4);
  };

  // --- HANDLERS ---
  const toggleModule = (id) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  const openModal = (subModule) => setSelectedSubModule(subModule);
  const closeModal = () => setSelectedSubModule(null);

  const handleStartLearning = () => {
    // Navigasi ke halaman modul detail dengan membawa data
    navigate('/modul', { 
      state: { 
        title: selectedSubModule.title,
        content: selectedSubModule.fullMateri 
      } 
    });
  };

  // --- RENDER LOADING / ERROR ---
  if (loading) return <div className="loading-state">Memuat Roadmap Anda...</div>;
  if (error) return <div className="error-state">{error}</div>;

  // --- RENDER UTAMA (TIDAK BANYAK BERUBAH DARI UI ANDA) ---
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
            <p className="header-subtitle">Roadmap Personal</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-card-roadmap">
          <div className="progress-info">
            <div>
              <h2 className="progress-title">Progres Keseluruhan</h2>
              <p className="progress-subtitle">
                {/* Hitung total item */}
                0 dari {roadmapData.reduce((acc, curr) => acc + curr.subModules.length, 0)} materi selesai
              </p>
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

        {/* Modules List (Dynamic Render) */}
        <div className="modules-list">
          {roadmapData.length === 0 ? (
            <p className="empty-state">Belum ada roadmap yang digenerate.</p>
          ) : (
            roadmapData.map((module) => {
              const isExpanded = expandedModuleId === module.id;

              return (
                <div key={module.id} className="module-wrapper">
                  {/* Phase Card */}
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
                        <span style={{marginLeft: 8, fontSize: 12}}>({module.subModules.length} Materi)</span>
                      </div>
                    </div>
                    <div className="module-action">
                      {isExpanded ? <ChevronUp color="#0B4251" size={20} /> : <ChevronDown color="#0B4251" size={20} />}
                    </div>
                  </div>

                  {/* Sub Modules List */}
                  {isExpanded && module.subModules.length > 0 && (
                    <div className="sub-modules-container">
                      {module.subModules.map((sub, index) => {
                        const isLocked = sub.status === 'locked';

                        return (
                          <div key={sub.id} className={`sub-module-card ${isLocked ? 'locked-card' : ''}`}>
                            
                            <div className="sub-module-number">{index + 1}</div>

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
                                <span className="tag-label">TOPICS</span>
                                <div className="tags-row">
                                  {sub.details.topics.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="source-tag">
                                      <BookOpen size={10} style={{marginRight:4}}/> 
                                      {tag.substring(0, 15)}...
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
                              {isLocked ? <Lock size={18} color="#9CA3AF" /> : <ArrowRight size={20} />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- MODAL POPUP (Detail Materi) --- */}
      {selectedSubModule && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedSubModule.title}</h2>
              <button className="btn-close" onClick={closeModal}><X size={24} /></button>
            </div>

            <p className="modal-desc" style={{maxHeight: '100px', overflowY: 'auto'}}>
              {/* Menampilkan isi materi lengkap di sini jika mau */}
              {selectedSubModule.fullMateri}
            </p>

            <div className="modal-badge-row">
              <div className="duration-badge">
                <Clock size={16} />
                <span>Estimasi: {selectedSubModule.details.duration}</span>
              </div>
            </div>

            <div className="modal-learning-section">
              <h3>Poin Pembelajaran</h3>
              <ul className="learning-list">
                {selectedSubModule.details.topics.map((topic, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={18} color="#22C55E" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="btn-start-learning" onClick={handleStartLearning}>
              Mulai Belajar <ArrowRight size={18} />
            </button>

          </div>
        </div>
      )}
    </div>
  );
};