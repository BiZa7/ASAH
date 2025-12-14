import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AIOutputRenderer from "../components/AIOutputRenderer";
import { Chatbot } from "../components/Chatbot";
import "./ModulPage.css";
import { quizService } from "../services/quizService";

// Icons
import {
  CheckCircle2,
  Lock,
  Lightbulb,
  Bot,
  ArrowRight,
  Check,
  Newspaper,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import ASAH from "../assets/ASAH.svg";

export const ModulPage = () => {
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);

  const location = useLocation();

  // 1. AMBIL ID DARI URL (Priority 1 - Anti Refresh)
  const { roadmapId: paramId } = useParams();

  // 2. AMBIL DATA DARI STATE (Priority 2 - Navigasi Normal)
  const stateData = location.state || {};

  // LOGIC GABUNGAN: Gunakan ID dari URL jika ada, jika tidak pakai dari state
  const roadmapId = paramId || stateData.roadmapId;
  const title = stateData.title || "Materi Pembelajaran";
  const content = stateData.content || "Konten sedang dimuat...";

  // --- INTERNAL STATE (Tab Materi/Rangkuman/Latihan) ---
  const [modules, setModules] = useState([
    { id: 1, title: "Materi Utama", status: "active" },
    { id: 2, title: "Rangkuman", status: "locked" },
    { id: 3, title: "Kuis Latihan", status: "locked" },
  ]);

  const [activeId, setActiveId] = useState(1);

  // Logic Status Kuis (Terbuka jika modul terakhir selesai)
  const isQuizUnlocked = modules[modules.length - 1].status === "completed";
  const isQuizView = activeId === "quiz";

  // Scroll ke atas saat ganti tab
  useEffect(() => {
    const contentArea = document.querySelector(".main-content");
    if (contentArea) contentArea.scrollTop = 0;

    // Safety Check
    if (!roadmapId) {
      console.warn(
        "Peringatan: roadmapId tidak ditemukan. Pastikan akses dari RoadmapPage."
      );
    }
  }, [activeId, roadmapId]);

  // --- NAVIGATION HANDLERS ---

  const handleNext = () => {
    const currentIndex = modules.findIndex((m) => m.id === activeId);

    // Jika belum di modul terakhir
    if (currentIndex < modules.length - 1) {
      const nextId = modules[currentIndex + 1].id;
      const updatedModules = modules.map((m) => {
        if (m.id === activeId) return { ...m, status: "completed" };
        if (m.id === nextId) return { ...m, status: "active" };
        return m;
      });
      setModules(updatedModules);
      setActiveId(nextId);
    }
    // Jika di modul terakhir, buka intro kuis
    else if (currentIndex === modules.length - 1) {
      const updatedModules = modules.map((m) => {
        if (m.id === activeId) return { ...m, status: "completed" };
        return m;
      });
      setModules(updatedModules);
      setActiveId("quiz");
    }
  };

  const handleSidebarClick = (id, status) => {
    if (status !== "locked") setActiveId(id);
  };

  // --- QUIZ INTEGRATION HANDLERS (CRITICAL) ---

  const navigateToQuiz = async () => {
    if (!roadmapId) {
      alert("Error: ID Materi hilang. Silakan kembali ke menu Roadmap.");
      return;
    }

    try {
      // 2. Mulai Loading
      setIsGenerating(true);

      // 3. Panggil API (Proses ini akan memakan waktu)
      await quizService.generateQuiz(roadmapId);

      // 4. Jika sukses, baru pindah halaman
      navigate("/quiz", {
        state: {
          roadmapId: roadmapId,
          moduleTitle: title, // asumsikan variabel 'title' ada di scope ini
        },
      });
    } catch (error) {
      console.error("Gagal generate kuis:", error);
      alert("Gagal menyiapkan kuis. Silakan coba lagi.");

      // 5. Jika gagal, matikan loading supaya user bisa coba lagi
      setIsGenerating(false);
    }
  };

  const handleQuizSidebarClick = () => {
    if (isQuizUnlocked) {
      navigateToQuiz();
    } else {
      alert("Selesaikan semua materi terlebih dahulu!");
    }
  };

  // --- RENDER CONTENT SECTIONS ---
  const renderContent = () => {
    if (isGenerating) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9fa", // Sesuaikan warna background
          }}
        >
          <Loader2 className="animate-spin" size={64} color="#0B4251" />
          <h3 style={{ marginTop: "20px", color: "#0B4251" }}>
            Menyiapkan Tantangan...
          </h3>
          <p style={{ color: "#666" }}>AI sedang membuat soal khusus untukmu</p>
        </div>
      );
    }
    // 1. Tampilan Intro Kuis (Setelah Materi Selesai)
    if (isQuizView) {
      return (
        <div className="quiz-intro-view">
          <div className="intro-card">
            <CheckCircle2
              size={64}
              color="#22C55E"
              style={{ marginBottom: "1rem" }}
            />
            <h1 className="content-title">Materi Selesai!</h1>
            <p className="content-paragraph">
              Anda telah menyelesaikan materi <strong>"{title}"</strong>. <br />
              Sekarang saatnya menguji pemahaman Anda.
            </p>
            <button className="btn-next-step primary" onClick={navigateToQuiz}>
              Mulai Kuis Sekarang <ArrowRight size={20} />
            </button>
          </div>
        </div>
      );
    }

    // 2. Tampilan Materi Utama
    if (activeId === 1) {
      return (
        <div className="content-container">
          <div className="breadcrumbs">
            Modul Pembelajaran &gt; {title}
            {/* Tambahkan Span ini untuk melihat ID */}
          </div>
          <h1 className="content-title">{title}</h1>

          {/* Renderer Markdown/AI */}
          <div className="materi-body">
            <AIOutputRenderer content={content} />
          </div>

          <div className="pro-tip-box">
            <div className="tip-icon">
              <Lightbulb size={24} color="#D97706" />
            </div>
            <div className="tip-content">
              <h4>ASAH Tip</h4>
              <p>
                Bingung dengan istilah di atas? Tanyakan langsung pada Assistant
                di panel kanan!
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 3. Placeholder Tab Lain
    if (activeId === 2)
      return (
        <div className="placeholder-view">
          <h1>Rangkuman</h1>
          <p>Fitur rangkuman otomatis sedang disiapkan AI kami.</p>
        </div>
      );
    if (activeId === 3)
      return (
        <div className="placeholder-view">
          <h1>Latihan Mandiri</h1>
          <p>Soal latihan pendalaman sedang dibuat.</p>
        </div>
      );

    return <div>Konten tidak ditemukan.</div>;
  };

  return (
    <div className="modul-page-wrapper">
      {/* HEADER */}
      

      <div className="modul-layout">
        {/* SIDEBAR KIRI (Navigation) */}
        <aside className="sidebar-left">
          <div className="sidebar-header">
            <h3>Daftar Isi</h3>
            <p className="progress-text">
              {modules.filter((m) => m.status === "completed").length}/
              {modules.length} Selesai
            </p>
          </div>

          <div className="module-list">
            {modules.map((part) => (
              <div
                key={part.id}
                className={`module-item ${part.status} ${
                  activeId === part.id ? "current-view" : ""
                }`}
                onClick={() => handleSidebarClick(part.id, part.status)}
              >
                <div className="module-item-icon">
                  {part.status === "completed" ? (
                    <Check size={16} className="icon-completed" />
                  ) : part.status === "locked" ? (
                    <Lock size={14} />
                  ) : (
                    <span className="icon-number">{part.id}</span>
                  )}
                </div>
                <span className="module-item-text">{part.title}</span>
              </div>
            ))}
          </div>

          <div
            className={`quiz-section ${isQuizUnlocked ? "active" : "locked"}`}
          >
            <div
              className={`module-item quiz-item ${
                isQuizUnlocked ? "active" : "locked"
              } ${isQuizView ? "current-view" : ""}`}
              onClick={handleQuizSidebarClick}
            >
              <div className="module-item-icon">
                <Newspaper
                  size={18}
                  className={isQuizUnlocked ? "icon-quiz-active" : "icon-quiz"}
                />
              </div>
              <div className="quiz-text-wrapper">
                <span className="module-item-text">Kuis Modul</span>
                <span className="quiz-subtitle">
                  {isQuizUnlocked ? "Siap dikerjakan" : "Terkunci"}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          {renderContent()}

          {/* Action Footer (Tombol Lanjut) */}
          {!isQuizView && (
            <div className="action-footer">
              <button className="btn-next-step" onClick={handleNext}>
                {activeId === modules.length
                  ? "Selesai & Buka Kuis"
                  : "Lanjut Materi"}{" "}
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </main>

        {/* SIDEBAR KANAN (Chatbot) */}
        <aside className="sidebar-right">
          <div className="assistant-header">
            <div className="assistant-avatar">
              <Bot size={24} color="#0B4251" />
            </div>
            <div className="assistant-info">
              <h4>ASAH Assistant</h4>
              <p>Tanya jawab materi</p>
            </div>
          </div>
          <div className="chatbot-wrapper">
            <Chatbot
              initialContext={`User sedang membaca modul: ${title}. Konten: ${
                content ? content.substring(0, 500) : "Loading..."
              }...`}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ModulPage;
