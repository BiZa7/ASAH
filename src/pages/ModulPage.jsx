import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. Import useLocation
import ReactMarkdown from 'react-markdown'; // 2. (Opsional) Untuk render Markdown
import { Chatbot } from '../components/Chatbot';
import './ModulPage.css';
import { 
  CheckCircle2, 
  Lock, 
  Lightbulb, 
  Bot, 
  ArrowRight,
  Check,
  Newspaper
} from 'lucide-react';
import ASAH from "../assets/ASAH.svg"; 

export const ModulPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Ambil state dari navigasi

  // 3. Ambil data dari RoadmapPage
  // Fallback data dummy jika user akses langsung via URL tanpa klik dari roadmap
  const { title = "Materi Belum Dipilih", content = "Silakan kembali ke roadmap dan pilih materi." } = location.state || {};

  // --- STATE ---
  // Kita simpan materi ini sebagai "Part 1" karena user memilih spesifik 1 materi
  // Jika ingin fitur "Next Module" jalan, Anda perlu mengirim Array materi dari RoadmapPage, bukan cuma 1.
  // Untuk saat ini, kita anggap user belajar 1 materi spesifik dulu.
  
  const [modules, setModules] = useState([
    { id: 1, title: "Materi Utama", status: "active" },
    { id: 2, title: "Rangkuman", status: "locked" }, // Simulasi part 2
    { id: 3, title: "Kuis Latihan", status: "locked" },
  ]);

  const [activeId, setActiveId] = useState(1);

  // Logic Quiz Unlocked
  const isQuizUnlocked = modules[modules.length - 1].status === 'completed';
  const isQuizView = activeId === 'quiz';

  // Scroll top saat ganti materi
  useEffect(() => {
    const contentArea = document.querySelector('.main-content');
    if (contentArea) contentArea.scrollTop = 0;
  }, [activeId]);


  // 4. LOGIC NEXT STEP
  const handleNext = () => {
    const currentIndex = modules.findIndex(m => m.id === activeId);
    
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
    else if (currentIndex === modules.length - 1) {
      const updatedModules = modules.map(m => {
        if (m.id === activeId) return { ...m, status: 'completed' };
        return m;
      });
      setModules(updatedModules);
      setActiveId('quiz');
    }
  };

  const handleSidebarClick = (id, status) => {
    if (status !== 'locked') setActiveId(id);
  };

  const handleQuizSidebarClick = () => {
    if (isQuizUnlocked) navigate('/quiz');
  };

  const handleStartQuiz = () => navigate('/quiz');

  // --- RENDER CONTENT (DINAMIS) ---
  const renderContent = () => {
    if (isQuizView) {
      return (
        <div className="quiz-intro-view">
          <h1 className="content-title">Selesai!</h1>
          <p className="content-paragraph">
            Anda telah menyelesaikan materi <strong>"{title}"</strong>.
          </p>
          <button className="btn-next-step" onClick={handleStartQuiz}>
            Mulai Kuis Pendek <ArrowRight size={20} />
          </button>
        </div>
      );
    }

    // Tampilan Materi
    // Kita gunakan activeId untuk simulasi tabs (Materi -> Rangkuman)
    // Tapi karena konten dari API cuma 1 string panjang, kita tampilkan di Part 1 semua.
    
    if (activeId === 1) {
      return (
        <div className="content-container">
          <div className="breadcrumbs">Modul Pembelajaran &gt; {title}</div>
          <h1 className="content-title">{title}</h1>
          
          {/* Tampilkan Materi dari AI */}
          <div className="markdown-content">
            {/* Jika pakai react-markdown */}
            <ReactMarkdown>{content}</ReactMarkdown>
            
            {/* Jika tidak pakai react-markdown (Fallback text biasa dengan newlines) */}
            {/* <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.8'}}>
                {content}
              </p> 
            */}
          </div>

          <div className="pro-tip-box">
            <div className="tip-icon"><Lightbulb size={24} color="#D97706" /></div>
            <div className="tip-content">
              <h4>ASAH Tip</h4>
              <p>Jika ada istilah yang membingungkan, tanyakan langsung pada Assistant di sebelah kanan!</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Placeholder untuk part 2 & 3 (Karena API baru kirim 1 materi utuh)
    if (activeId === 2) {
      return (
        <div>
          <h1>Rangkuman</h1>
          <p>Fitur rangkuman otomatis akan segera hadir.</p>
        </div>
      );
    }

    return <div>Konten belum tersedia.</div>;
  };

  return (
    <div className="modul-page-wrapper">
      <header className="modul-header">
        <div className="header-left">
          <img src={ASAH} alt="ASAH Logo" className="header-logo" />
        </div>
        <div className="header-right">
          <div className="path-progress-badge">
            {modules.filter(m => m.status === 'completed').length}/{modules.length} Bagian Selesai
          </div>
        </div>
      </header>

      <div className="modul-layout">
        {/* Sidebar Kiri */}
        <aside className="sidebar-left">
          <div className="sidebar-header">
            <h3>Daftar Isi</h3>
          </div>
          <div className="module-list">
            {modules.map((part) => (
              <div 
                key={part.id} 
                className={`module-item ${part.status} ${activeId === part.id ? 'current-view' : ''}`}
                onClick={() => handleSidebarClick(part.id, part.status)}
              >
                <div className="module-item-icon">
                  {part.status === 'completed' ? <Check size={20} className='icon-completed'/> : 
                   part.status === 'locked' ? <Lock size={18} /> : 
                   <span className="icon-number">{part.id}</span>}
                </div>
                <span className="module-item-text">{part.title}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {renderContent()}
          
          {!isQuizView && (
            <div className="action-footer">
              <button className="btn-next-step" onClick={handleNext}>
                {activeId === modules.length ? "Selesai" : "Lanjut"} <ArrowRight size={20} />
              </button>
            </div>
          )}
        </main>

        {/* Sidebar Kanan (Chatbot) */}
        <aside className="sidebar-right">
          <div className="assistant-header">
            <div className="assistant-avatar"><Bot size={24} color="#0B4251" /></div>
            <div className="assistant-info">
              <h4>ASAH Assistant</h4>
              <p>Tanya tentang materi ini</p>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             {/* Kirim context materi ke Chatbot agar dia pintar menjawab */}
             <Chatbot initialContext={`User sedang membaca materi tentang: ${title}. Isi materi: ${content.substring(0, 500)}...`} />
          </div>
        </aside>
      </div>
    </div>
  );
};