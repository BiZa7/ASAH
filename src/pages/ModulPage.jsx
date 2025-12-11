import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './ModulPage.css';
import { 
  CheckCircle2, 
  Lock, 
  Lightbulb, 
  Bot, 
  SendHorizontal,
  ArrowRight,
  Check,
  Newspaper
} from 'lucide-react';
import ASAH from "../assets/ASAH.svg"; 

export const ModulPage = () => {
  const navigate = useNavigate(); // Inisialisasi navigasi

  // Data Modul (Hanya 5 part materi, TIDAK ADA ID 99)
  const [modules, setModules] = useState([
    { id: 1, title: "Pengenalan Excel", status: "active" },
    { id: 2, title: "Konsep Excel", status: "active" },
    { id: 3, title: "Teknologi dasar", status: "active" }, 
    { id: 4, title: "Excel untuk Industri", status: "locked" },
    { id: 5, title: "Tools pendukung", status: "locked" },
  ]);

  const [activeId, setActiveId] = useState(1);
  const [chatInput, setChatInput] = useState("");

  // 2. Logic cek apakah Kuis sudah boleh terbuka
  // Kuis terbuka jika modul TERAKHIR (index 4 / ID 5) sudah 'completed'
  const isQuizUnlocked = modules[modules.length - 1].status === 'completed';

  // 3. Logic jika user sedang melihat halaman Intro Kuis (activeId kita set string 'quiz')
  const isQuizView = activeId === 'quiz';

  useEffect(() => {
    const contentArea = document.querySelector('.main-content');
    if (contentArea) contentArea.scrollTop = 0;
  }, [activeId]);

  // --- KONTEN MATERI ---
  const contentMap = {
    1: { title: "Pengenalan Excel", content: <p>Materi Pengenalan...</p> },
    2: { title: "Konsep Excel", content: <p>Materi Konsep...</p> },
    3: {
      title: "Konsep Utama",
      breadcrumbs: "Part 3 > Teknologi dasar",
      intro: "Selamat datang di modul pembelajaran komprehensif ini...",
      keyConcepts: "Topik ini membahas prinsip-prinsip penting...",
      goals: ["Memahami prinsip.", "Mempelajari terminologi.", "Mengembangkan skill.", "Bangun kepercayaan diri."],
      details: "Mari kita telusuri lebih dalam pokok bahasan ini..."
    },
    4: { title: "Excel untuk Industri", content: <p>Materi Industri...</p> },
    5: { title: "Tools Pendukung", content: <p>Materi Tools...</p> }
  };

  // 4. Update Handle Next
  const handleNext = () => {
    const currentIndex = modules.findIndex(m => m.id === activeId);
    
    // Jika masih ada materi selanjutnya (Part 1 s.d 4)
    if (currentIndex < modules.length - 1) {
      const nextId = modules[currentIndex + 1].id;
      const updatedModules = modules.map(m => {
        if (m.id === activeId) return { ...m, status: 'completed' };
        if (m.id === nextId) return { ...m, status: 'active' };
        return m;
      });
      setModules(updatedModules);
      setActiveId(nextId);
    } 
    // Jika ini adalah materi TERAKHIR (Part 5)
    else if (currentIndex === modules.length - 1) {
      const updatedModules = modules.map(m => {
        if (m.id === activeId) return { ...m, status: 'completed' };
        return m;
      });
      setModules(updatedModules);
      
      
      setActiveId('quiz');
    }
  };

  // Handle Klik Sidebar Materi
  const handleSidebarClick = (id, status) => {
    if (status !== 'locked') {
      setActiveId(id);
    }
  };

  // 5. Handle Klik Sidebar Kuis (Manual)
  const handleQuizSidebarClick = () => {
    if (isQuizUnlocked) {
      navigate('/quiz');
    }
  };

  // 6. Handle Tombol "Mulai Kuis" (Navigasi Pindah Page)
  const handleStartQuiz = () => {
    // Arahkan ke route kuis yang sebenarnya
    // Pastikan route ini sudah dibuat di App.js
    navigate('/quiz'); 
  };

  // Render Konten
  const renderContent = () => {
    // A. Tampilan Intro Kuis (Jika activeId === 'quiz')
    if (isQuizView) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <h1 className="content-title" style={{textAlign: 'center'}}>Kuis Modul Excel</h1>
          <p className="content-paragraph" style={{textAlign: 'center', maxWidth: '600px'}}>
            Selamat! Anda telah menyelesaikan semua materi. Sekarang saatnya menguji pemahaman Anda melalui kuis singkat.
          </p>
          <div style={{ marginTop: '30px' }}>
            <button className="btn-next-step" onClick={handleStartQuiz}>
              Mulai Mengerjakan Kuis <ArrowRight size={20} />
            </button>
          </div>
        </div>
      );
    }

    // B. Tampilan Materi Biasa (Part 3 yang lengkap)
    if (activeId === 3) {
      const data = contentMap[3];
      return (
        <>
          <div className="breadcrumbs">{data.breadcrumbs}</div>
          <h1 className="content-title">{data.title}</h1>
          <p className="content-paragraph">{data.intro}</p>
          <h2 className="section-title">Key Concepts</h2>
          <p className="content-paragraph">{data.keyConcepts}</p>
          <div className="pro-tip-box">
            <div className="tip-icon"><Lightbulb size={24} color="#D97706" /></div>
            <div className="tip-content">
              <h4>Pro Tip</h4>
              <p>Luangkan waktu Anda untuk memahami setiap konsep secara menyeluruh.</p>
            </div>
          </div>
          <h2 className="section-title">Tujuan Pembelajaran</h2>
          <ul className="learning-goals">
            {data.goals.map((g, i) => (
              <li key={i}><div className="check-icon"><CheckCircle2 size={18} /></div><span>{g}</span></li>
            ))}
          </ul>
          <h2 className="section-title">Penjelasan Lebih Lanjut</h2>
          <p className="content-paragraph">{data.details}</p>
          <br /><br />
        </>
      );
    } 
    // C. Tampilan Materi Lainnya (Part 1, 2, 4, 5)
    else {
      return (
        <>
          <div className="breadcrumbs">Part {activeId} &gt; {contentMap[activeId]?.title}</div>
          <h1 className="content-title">{contentMap[activeId]?.title}</h1>
          <div className="content-paragraph" style={{minHeight: '300px'}}>
            {contentMap[activeId]?.content || "Konten sedang dimuat..."}
          </div>
        </>
      );
    }
  };

  return (
    <div className="modul-page-wrapper">
      <header className="modul-header">
        <div className="header-left">
          <img src={ASAH} alt="ASAH Logo" className="header-logo" />
        </div>
        <div className="header-right">
          <div className="path-progress-badge">
            {modules.filter(m => m.status === 'completed').length}/{modules.length} Path Selesai
          </div>
        </div>
      </header>

      <div className="modul-layout">
        <aside className="sidebar-left">
          <div className="sidebar-header">
            <h3>Konten Modul</h3>
            <p>Selesaikan semua part untuk membuka kuis</p>
          </div>
          
          <div className="module-list">
            {modules.map((part) => (
              <div 
                key={part.id} 
                className={`module-item ${part.status} ${activeId === part.id ? 'current-view' : ''}`}
                onClick={() => handleSidebarClick(part.id, part.status)}
              >
                <div className="module-item-icon">
                  {part.status === 'completed' && <Check size={20} className='icon-completed'/>}
                  {part.status === 'active' && <span className="icon-number">{part.id}</span>}
                  {part.status === 'locked' && <Lock size={18} />}
                </div>
                <span className="module-item-text">{part.title}</span>
              </div>
            ))}
          </div>

          {/* 7. UPDATE: Modul Kuis di Kiri Bawah menjadi Dinamis */}
          <div className={`quiz-section ${isQuizUnlocked ? 'active' : 'locked'}`}>
            <div 
              className={`module-item quiz-item ${isQuizUnlocked ? 'active' : 'locked'} ${isQuizView ? 'current-view' : ''}`}
              onClick={handleQuizSidebarClick} // Pasang event click disini
            >
              <div className="module-item-icon">
                {/* Ganti Icon Gembok jadi File jika unlocked */}
                {isQuizUnlocked ? <Newspaper size={18} className='icon-quiz-active' /> : <Newspaper size={18} className='icon-quiz'/>}
              </div>
              <div className="quiz-text-wrapper">
                <span className="module-item-text">Modul Kuis</span>
                <span className="quiz-subtitle">
                  {isQuizUnlocked ? 'Siap dikerjakan' : 'Selesaikan semua path terlebih dahulu'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {renderContent()}
          
          {/* Tombol Lanjut (Hanya muncul jika bukan di view Intro Kuis) */}
          {!isQuizView && (
            <div className="action-footer">
                <button className="btn-next-step" onClick={handleNext}>
                  {/* Text Tombol berubah di modul terakhir */}
                  {activeId === 5 ? "Selesai & Buka Kuis" : "Selesai & Lanjut"} 
                  <ArrowRight size={20} />
                </button>
            </div>
          )}
        </main>

        <aside className="sidebar-right">
          <div className="assistant-header">
            <div className="assistant-avatar">
              <Bot size={24} color="#0B4251" />
            </div>
            <div className="assistant-info">
              <h4>ASAH Assistant</h4>
              <p>Asisten belajar kamu</p>
            </div>
          </div>
          <div className="chat-area">
            <div className="empty-state">
              <p>Halo! Ada yang bisa saya bantu?</p>
            </div>
          </div>
          <div className="chat-input-wrapper">
            <div className="chat-input-container">
              <input type="text" placeholder="Tanyakan apapun..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
              <button className="btn-send"><SendHorizontal size={18} /></button>
            </div>
            <p className="ai-disclaimer">AI dapat membuat kesalahan.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};