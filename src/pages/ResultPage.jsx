import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';
// Import service
import { optionCareer } from '../services/roadmapService'; 
import api from '../utils/api';

// Assets
import trophy from "../assets/trophy.svg";
import arrowright from "../assets/arrowright.svg"; 
import barchart from "../assets/barchart.svg";

export const ResultPage = () => {
  const navigate = useNavigate();

  const [careerMatches, setCareerMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  
  // 1. STATE BARU: Untuk loading tombol generate
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        setIsLoading(true);
        const response = await optionCareer.getOptionsCareer();

        if (response.success) {
          const rawData = response.data || [];
          const mappedData = rawData.map((item, index) => ({
            id: item.id_career || index, 
            title: item.name || "Nama Karir Tidak Tersedia", 
            description: item.description || "Deskripsi belum tersedia",
            percentage: item.similarity ? Math.round(Number(item.similarity) * 100) : 0, 
            skills: item.skills || ["Analytical", "Problem Solving", "Critical Thinking"] 
          }));

          setCareerMatches(mappedData);
        } else {
           setError(response.message || "Gagal mendapatkan data rekomendasi.");
        }

      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError("Gagal memuat rekomendasi karir. Pastikan Anda sudah login atau melakukan tes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, []);


  const handleCardClick = (id) => {
    if (selectedCardId === id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(id);
    }
  };

  // 2. UPDATE FUNGSI GENERATE
  const handleGenerateRoadmap = async () => {
    if (!selectedCardId) return;
    console.log(`selectedCardId: ${selectedCardId}`);
    

    try {
      setIsGenerating(true);

      // --- PERUBAHAN DISINI ---
      // Kita memanggil endpoint yang menjalankan KEDUANYA sekaligus
      
      // 1. Ambil Token
      let token = localStorage.getItem("accessToken");
      if (token && token.startsWith('"')) token = token.slice(1, -1);

      // 2. Request ke Backend
      // Asumsi endpoint backend: POST /roadmap/generate-full
      const response = await api.post(
        "/ai/roadmap", 
        { id_career: selectedCardId }, // Body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Full Generation Success:", response);

      await optionCareer.generateFullRoadmap(selectedCardId);

      // 3. Navigasi setelah SELESAI semua (Struktur + Materi)
      navigate('/roadmap-loading', { 
          state: { 
              selectedCareerId: selectedCardId,
              message: "Struktur berhasil dibuat! AI sedang menulis materi detail untukmu..." 
          } 
      });

    } catch (err) {
      console.error("Gagal generate roadmap:", err);
      alert("Terjadi kesalahan atau waktu habis. Silakan cek halaman roadmap Anda.");
      // Opsional: Tetap navigate karena mungkin backend masih memproses di background
      // navigate('/roadmap-loading'); 
    } finally {
      setIsGenerating(false);
    }
  };

  // Tampilan saat Loading Data Awal
  if (isLoading) {
    return (
        <div className="result-page" style={{display:'flex', justifyContent:'center', alignItems:'center', height: '100vh'}}>
            <div className="spinner"></div> 
            <p style={{marginLeft: '10px'}}>Memuat rekomendasi...</p>
        </div>
    );
  }

  // Tampilan saat Error
  if (error) {
    return (
        <div className="result-page" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height: '100vh'}}>
            <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>
            <button onClick={() => window.location.reload()} style={{padding: '10px 20px', cursor:'pointer'}}>Coba Lagi</button>
        </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-container">
        
        {/* Header Section */}
        <div className="result-header-section">
          <div className="trophy-icon-container">
            <img src={trophy} alt="Trophy" style={{width: '32px', height: '32px'}} />
          </div>
          <h1 className="result-title">Rekomendasi Karir Untuk Kamu!</h1>
          <div className="result-subtitle-container">
            <p className="result-subtitle">
            Berdasarkan hasil tes kepribadian dan bakatmu, kami telah menentukan jalur karier 
            yang paling sesuai. Pilih salah satu untuk mulai menyusun roadmap pembelajaranmu.
            </p>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="career-grid">
          {careerMatches.length > 0 ? (
            careerMatches.map((career) => (
                <div 
                  key={career.id} 
                  className={`career-card ${selectedCardId === career.id ? 'selected' : ''}`}
                  onClick={() => handleCardClick(career.id)}
                >
                <div className="card-top">
                    <div className="card-icon">
                    <span style={{color: '#F2C864', fontSize: '20px'}}>
                        <img src={barchart} alt="Bar Chart" style={{width: '24px', height: '24px'}} />
                    </span>
                    </div>
                    <span className="match-percentage">{career.percentage}% Match</span>
                </div>
                
                <h3 className="career-title">{career.title}</h3>
                <p className="career-desc">{career.description}</p>
                
                <div className="skills-section">
                    <p className="skills-label">Key Skills</p>
                    <div className="skills-tags">
                    {career.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    </div>
                </div>
                </div>
            ))
          ) : (
              <p>Tidak ada rekomendasi karir yang ditemukan.</p>
          )}
        </div>

        {/* Bottom Action Button */}
        <div className="bottom-action">
          <button 
            className="btn-generate" 
            onClick={handleGenerateRoadmap}
            // 3. UPDATE: Disable tombol jika belum pilih ATAU sedang loading
            disabled={!selectedCardId || isGenerating} 
            style={{ opacity: (!selectedCardId || isGenerating) ? 0.6 : 1, cursor: (!selectedCardId || isGenerating) ? 'not-allowed' : 'pointer' }}
          >
            {isGenerating ? (
                <>
                  Memproses Pilihan...
                  <div className="spinner-small" style={{marginLeft: '10px', width:'16px', height:'16px', border:'2px solid #fff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div>
                </>
            ) : (
                <>
                  Generate Roadmap pembelajaran saya
                  <img src={arrowright} alt="Arrow" style={{width: '20px', marginLeft: '10px'}} />
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};