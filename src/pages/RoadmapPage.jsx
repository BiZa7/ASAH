import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { optionCareer } from "../services/roadmapService"; // Sesuaikan path import
import AIOutputRenderer from "../components/AIOutputRenderer";
import "./RoadmapPage.css";
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
} from "lucide-react";

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
    let isMounted = true; // Mencegah update state jika komponen sudah di-unmount

    const fetchData = async (isBackground = false) => {
      try {
        // Hanya set loading true jika ini BUKAN background fetch (fetch pertama kali)
        if (!isBackground) {
          setLoading(true);
        }

        const response = await optionCareer.getMaterialUser("");

        const roadmapExist = await optionCareer.getRoadmap();

        if (isMounted) {
          if (roadmapExist.status == 200 && roadmapExist.data) {
            const groupedData = processBackendData(response.data);

            // Update data roadmap secara real-time
            setRoadmapData(groupedData);

            // Opsional: Jika backend mengirim status selesai, kita bisa stop polling disini
            // Contoh: if (response.data.status === 'COMPLETED') clearInterval(intervalId);
          } else {
            // Jika data kosong di fetch pertama, mungkin redirect.
            // Tapi jika sedang polling, biarkan saja (mungkin AI sedang bekerja).
            if (
              !isBackground &&
              (!response.data || response.data.length === 0)
            ) {
              navigate("/psikotes");
            }
          }
        }
      } catch (err) {
        console.error("Error loading roadmap:", err);
        // Jangan tampilkan error full screen jika gagal saat background fetch
        if (!isBackground) setError("Gagal memuat materi roadmap.");
      } finally {
        if (isMounted && !isBackground) {
          setLoading(false);
        }
      }
    };

    // 1. Panggil fetch pertama kali (Loading screen muncul)
    fetchData(false);

    // 2. Set Interval untuk Polling setiap 5 detik (5000ms)
    // Ini akan mengambil data baru tanpa loading screen
    const intervalId = setInterval(() => {
      fetchData(true);
    }, 5000);

    // Cleanup function: Hentikan interval saat user pindah halaman
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const removeMarkdown = (markdown) => {
    if (!markdown) return "";
    return (
      markdown
        // 1. Hapus Header (#, ##, ###)
        .replace(/#{1,6}\s?/g, "")
        // 2. Hapus Bold/Italic (**, *, __, _)
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/__/g, "")
        .replace(/_/g, "")
        // 3. Hapus Link [text](url) -> text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        // 4. Hapus Code Block (```...```) dan inline code (`)
        .replace(/`{3}[\s\S]*?`{3}/g, "")
        .replace(/`/g, "")
        // 5. Hapus list item markers (-, *, 1.)
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        // 6. Ganti baris baru dengan spasi
        .replace(/\n/g, " ")
        // 7. Rapikan spasi berlebih
        .replace(/\s{2,}/g, " ")
        .trim()
    );
  };

  // --- LOGIC: DATA TRANSFORMATION ---
  // Mengubah Flat List dari DB menjadi Hierarchical List untuk UI
  const processBackendData = (items) => {
    const groups = {};

    items.forEach((item, index) => {
      // 1. PHASE HANDLING
      // Jika di backend tidak ada field 'phase' per item,
      // kamu bisa menggunakan default atau logic lain.
      const phaseName = item.phase || "Phase Pembelajaran";

      if (!groups[phaseName]) {
        groups[phaseName] = {
          id: `phase-${index}`, // ID unik untuk grup fase
          title: phaseName,
          duration: "Estimasi 1-2 Minggu",
          subModules: [],
        };
      }

      const cleanDescription = removeMarkdown(item.materi);

      // 2. TOPIC EXTRACTION
      let finalTopics = [];
      if (item.module && Array.isArray(item.module) && item.module.length > 0) {
        finalTopics = item.module;
      } else {
        finalTopics = extractTopics(cleanDescription);
      }

      // 3. MAPPING DATA (PERBAIKAN UTAMA DISINI)
      groups[phaseName].subModules.push({
        // Gunakan 'id_item' sesuai respon backend
        id: item.id_item,

        // Simpan id_roadmap juga jika nanti dibutuhkan
        roadmapId: item.id_roadmap,

        // Mapping field lainnya sesuai JSON
        title: item.judul,

        description: cleanDescription
          ? cleanDescription.substring(0, 100) + "..."
          : "Pelajari materi ini untuk menguasai skill terkait.",

        tags: ["Materi Utama"],
        status: "available",

        // Mapping konten materi
        fullMateri: item.materi,

        details: {
          duration: "30-60 Menit",
          topics: finalTopics,
        },
      });
    });

    return Object.values(groups);
  };

  // Helper sederhana untuk memecah teks materi jadi poin-poin (jika ada format markdown/list)
  const extractTopics = (cleanText) => {
    if (!cleanText) return ["Konsep Dasar", "Implementasi"];

    // Ambil kalimat pertama atau pecah berdasarkan titik
    // Ini lebih baik daripada split('\n') karena teks sudah dibersihkan jadi satu baris
    const sentences = cleanText.split(". ");

    // Ambil 3-4 frasa pertama yang cukup panjang (hindari angka/simbol saja)
    return sentences.filter((s) => s.length > 10 && s.length < 50).slice(0, 3);
  };

  // --- HANDLERS ---
  const toggleModule = (id) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  const openModal = (subModule) => setSelectedSubModule(subModule);
  const closeModal = () => setSelectedSubModule(null);

  const handleStartLearning = () => {
    // Navigasi ke halaman modul detail dengan membawa data lengkap
    // Update: Tambahkan ID ke URL dan ke State
    console.log("Selected Module:", selectedSubModule);

    navigate(`/modul/${selectedSubModule.id}`, {
      state: {
        title: selectedSubModule.title,
        content: selectedSubModule.fullMateri,
        roadmapId: selectedSubModule.id, // <--- INI KUNCI UTAMANYA
      },
    });
  };

  // --- RENDER LOADING / ERROR ---
  if (loading)
    return <div className="loading-state">Memuat Roadmap Anda...</div>;
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
                {/* Hitung total item */}0 dari{" "}
                {roadmapData.reduce(
                  (acc, curr) => acc + curr.subModules.length,
                  0
                )}{" "}
                materi selesai
              </p>
            </div>
            <div className="progress-percentage-box">
              <span className="percentage-text">0%</span>
              <span className="percentage-label">Selesai</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: "0%" }}></div>
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
                    className={`module-card ${isExpanded ? "active" : ""}`}
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
                        <span style={{ marginLeft: 8, fontSize: 12 }}>
                          ({module.subModules.length} Materi)
                        </span>
                      </div>
                    </div>
                    <div className="module-action">
                      {isExpanded ? (
                        <ChevronUp color="#0B4251" size={20} />
                      ) : (
                        <ChevronDown color="#0B4251" size={20} />
                      )}
                    </div>
                  </div>

                  {/* Sub Modules List */}
                  {isExpanded && module.subModules.length > 0 && (
                    <div className="sub-modules-container">
                      {module.subModules.map((sub, index) => {
                        const isLocked = sub.status === "locked";

                        return (
                          <div
                            key={sub.id}
                            className={`sub-module-card ${
                              isLocked ? "locked-card" : ""
                            }`}
                          >
                            <div className="sub-module-number">{index + 1}</div>

                            <div className="sub-module-content">
                              <div className="sub-header">
                                <h4 className="sub-title">{sub.title}</h4>
                                {isLocked ? (
                                  <span className="badge-gray">Locked</span>
                                ) : (
                                  <span className="badge-yellow">
                                    Available
                                  </span>
                                )}
                              </div>

                              <p className="sub-desc">{sub.description}</p>

                              <div className="sub-tags">
                                <span className="tag-label">TOPICS</span>
                                <div className="tags-row">
                                  {sub.details.topics
                                    .slice(0, 3)
                                    .map((tag, idx) => (
                                      <span key={idx} className="source-tag">
                                        <BookOpen
                                          size={10}
                                          style={{ marginRight: 4 }}
                                        />
                                        {tag.substring(0, 15)}...
                                      </span>
                                    ))}
                                </div>
                              </div>
                            </div>

                            <button
                              className={`btn-arrow-action ${
                                isLocked ? "btn-locked" : ""
                              }`}
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
              <button className="btn-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            {/* --- BAGIAN INI DIMODIFIKASI --- */}
            {/* Gunakan wrapper div untuk mengatur scroll jika materi panjang */}
            <div className="modal-materi-preview">
              {/* Gunakan Renderer Estetik */}
              <AIOutputRenderer content={selectedSubModule.fullMateri} />
            </div>
            {/* ------------------------------- */}

            <div className="modal-badge-row">
              <div className="duration-badge">
                <Clock size={16} />
                <span>Estimasi: {selectedSubModule.details.duration}</span>
              </div>
            </div>

            {/* ... Bagian Poin Pembelajaran & Tombol Mulai Belajar tetap sama ... */}
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

            <button
              className="btn-start-learning"
              onClick={handleStartLearning}
            >
              Mulai Belajar <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
