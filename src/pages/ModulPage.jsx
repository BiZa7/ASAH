import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Chatbot } from '../components/Chatbot';
import './ModulPage.css';
import { 
  CheckCircle2, 
  Lock, 
  Lightbulb, 
  Bot, 
  ArrowRight,
  Check,
  Newspaper, // Pastikan import ini ada
  FileText
} from 'lucide-react';
import ASAH from "../assets/ASAH.svg"; 

export const ModulPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data dari RoadmapPage (Title & Content Materi)
  const { title = "Materi Belum Dipilih", content = "Silakan kembali ke roadmap dan pilih materi." } = location.state || {};

  // --- STATE ---
  const [modules, setModules] = useState([
    { id: 1, title: "Materi Utama", status: "active" },
    { id: 2, title: "Rangkuman", status: "locked" },
    { id: 3, title: "Kuis Latihan", status: "locked" }
  ]);

  const [activeId, setActiveId] = useState(1);

  // 1. LOGIC QUIZ UNLOCKED
  // Kuis di sidebar kiri bawah terbuka jika modul terakhir (ID 3) sudah 'completed'
  const isQuizUnlocked = modules[modules.length - 1].status === 'completed';
  
  // Logic View Intro Kuis (di layar tengah)
  const isQuizView = activeId === 'quiz';

  useEffect(() => {
    const contentArea = document.querySelector('.main-content');
    if (contentArea) contentArea.scrollTop = 0;
  }, [activeId]);


  // --- LOGIC NEXT STEP ---
  const handleNext = () => {
    const currentIndex = modules.findIndex(m => m.id === activeId);
    
    // Jika belum modul terakhir
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
    // Jika modul terakhir selesai -> Buka Kuis
    else if (currentIndex === modules.length - 1) {
      const updatedModules = modules.map(m => {
        if (m.id === activeId) return { ...m, status: 'completed' };
        return m;
      });
      setModules(updatedModules);
      
      // Pindah ke Intro Kuis (Tampilan Tengah)
      setActiveId('quiz');
    }
  };

  const handleSidebarClick = (id, status) => {
    if (status !== 'locked') setActiveId(id);
  };

  // 2. HANDLER TOMBOL SIDEBAR KUIS
  const handleQuizSidebarClick = () => {
    if (isQuizUnlocked) {
      // Opsi A: Langsung navigasi ke /quiz
      navigate('/quiz');
      
      // Opsi B: Atau tampilkan Intro di tengah dulu (pilih salah satu)
      // setActiveId('quiz'); 
    } else {
      alert("Selesaikan semua materi terlebih dahulu!");
    }
  };

  const handleStartQuiz = () => navigate('/quiz');

  // --- RENDER CONTENT ---
  const renderContent = () => {
    // Tampilan Intro Kuis (Saat tombol selesai diklik)
    if (isQuizView) {
      return (
        <div className="quiz-intro-view" style={{textAlign:'center', marginTop:'50px'}}>
          <h1 className="content-title">Selesai!</h1>
          <p className="content-paragraph">
            Anda telah menyelesaikan materi <strong>"{title}"</strong>.
          </p>
          <div style={{marginTop: '30px'}}>
            <button className="btn-next-step" onClick={handleStartQuiz} style={{margin:'0 auto'}}>
              Mulai Kuis  <ArrowRight size={20} />
            </button>
          </div>
        </div>
      );
    }

    // Tampilan Materi Utama (Part 1)
    if (activeId === 1) {
      return (
        <div className="content-container">
          <div className="breadcrumbs">Modul Pembelajaran &gt; {title}</div>
          <h1 className="content-title">{title}</h1>
          
          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
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
    
    // Placeholder Part 2 & 3
    if (activeId === 2) return <div><h1>Rangkuman</h1><p>Fitur rangkuman otomatis akan segera hadir.</p></div>;
    if (activeId === 3) return <div><h1>Kuis Latihan</h1><p>Soal latihan sedang disiapkan.</p></div>;

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
        
        {/* SIDEBAR KIRI */}
        <aside className="sidebar-left">
          <div className="sidebar-header">
            <h3>Daftar Isi</h3>
            <p>Selesaikan untuk membuka kuis</p>
          </div>
          
          {/* List Materi */}
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

          {/* 3. TOMBOL MODUL KUIS DI KIRI BAWAH (DIKEMBALIKAN) */}
          <div className={`quiz-section ${isQuizUnlocked ? 'active' : 'locked'}`}>
            <div 
              className={`module-item quiz-item ${isQuizUnlocked ? 'active' : 'locked'} ${isQuizView ? 'current-view' : ''}`}
              onClick={handleQuizSidebarClick}
            >
              <div className="module-item-icon">
                {isQuizUnlocked ? <Newspaper size={18} className='icon-quiz-active' /> : <Newspaper size={18} className='icon-quiz' />}
              </div>
              <div className="quiz-text-wrapper">
                <span className="module-item-text">Modul Kuis</span>
                <span className="quiz-subtitle">
                  {isQuizUnlocked ? 'Siap dikerjakan' : 'Selesaikan materi dahulu'}
                </span>
              </div>
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {renderContent()}
          
          {!isQuizView && (
            <div className="action-footer">
              <button className="btn-next-step" onClick={handleNext}>
                {activeId === modules.length ? "Selesai & Buka Kuis" : "Lanjut"} <ArrowRight size={20} />
              </button>
            </div>
          )}
        </main>

        {/* SIDEBAR KANAN */}
        <aside className="sidebar-right">
          <div className="assistant-header">
            <div className="assistant-avatar"><Bot size={24} color="#0B4251" /></div>
            <div className="assistant-info">
              <h4>ASAH Assistant</h4>
              <p>Tanya tentang materi ini</p>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             <Chatbot initialContext={`User sedang membaca: ${title}. Isi: ${content.substring(0, 300)}...`} />
          </div>
        </aside>

      </div>
    </div>
  );
};