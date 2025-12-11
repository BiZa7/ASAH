import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';
// Import service
import { optionCareer } from '../services/roadmapService'; 

// Assets
import trophy from "../assets/trophy.svg";
import arrowright from "../assets/arrowright.svg"; 
import barchart from "../assets/barchart.svg";

export const ResultPage = () => {
  const navigate = useNavigate();

  const [careerMatches, setCareerMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        setIsLoading(true);
        
        // 1. PERBAIKAN: Gunakan method GET (getOptionsCareer), bukan POST
        const response = await optionCareer.getOptionsCareer();

        console.log("Full Response (GET):", response); 

        // 2. Cek response success
        if (response.success) {
          
          const rawData = response.data || [];

          // 4. Mapping Data
          const mappedData = rawData.map((item, index) => ({
            // Gunakan optional chaining (?.)
            id: item.id_career || index, 
            title: item.name || "Nama Karir Tidak Tersedia", 
            description: item.description || "Deskripsi belum tersedia",
            
            // Konversi similarity ke persentase
            percentage: item.similarity ? Math.round(Number(item.similarity) * 100) : 0, 
            
            // Default skills (karena endpoint GET backend belum return skills array)
            skills: item.skills || ["Analytical", "Problem Solving", "Critical Thinking"] 
          }));

          setCareerMatches(mappedData);
        } else {
            // Tampilkan pesan error dari backend jika success: false
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

  const handleGenerateRoadmap = () => {
    navigate('/roadmap-loading');
  };

  // Tampilan saat Loading
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
                <div key={career.id} className="career-card">
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
          <button className="btn-generate" onClick={handleGenerateRoadmap}>
            Generate Roadmap pembelajaran saya
            <img src={arrowright} alt="Arrow" style={{width: '20px', marginLeft: '10px'}} />
          </button>
        </div>

      </div>
    </div>
  );
};