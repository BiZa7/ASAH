import React, { useState, useEffect } from 'react'; // 1. Import Hooks
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';
// Import service API
import { optionCareer } from '../services/roadmapService'; // Pastikan path-nya benar

// Assets
import trophy from "../assets/trophy.svg";
import arrowright from "../assets/arrowright.svg"; 
import barchart from "../assets/barchart.svg";

export const ResultPage = () => {
  const navigate = useNavigate();

  // 2. Buat State untuk data dan loading status
  const [careerMatches, setCareerMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Panggil API saat komponen di-mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await optionCareer.getOptionsCareer();

        // Cek apakah response sukses dan memiliki data
        if (response.success && Array.isArray(response.data)) {
          
          // 4. Mapping Data (PENTING!)
          // API kamu mengembalikan: id_career, name, description
          // UI kamu butuh: id, title, percentage, description, skills
          // Kita harus konversi formatnya:
          const mappedData = response.data.map((item) => ({
            id: item.id_career,
            title: item.name,        // API: name -> UI: title
            description: item.description,
            
            // Note: Karena API di prompt sebelumnya belum return percentage & skills,
            // kita beri nilai default/random dulu agar UI tidak error.
            // Nanti sesuaikan jika API sudah mengirim data ini.
            percentage: item.similarity ? Math.round(item.similarity * 100) : 85, 
            skills: item.skills || ["Skill A", "Skill B", "Skill C"] 
          }));

          setCareerMatches(mappedData);
        }
      } catch (err) {
        console.error("Error fetching careers:", err);
        setError("Gagal memuat rekomendasi karir.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateRoadmap = () => {
    navigate('/roadmap-loading');
  };

  // Tampilan saat Loading
  if (isLoading) {
    return <div className="result-page" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>Loading...</div>;
  }

  // Tampilan saat Error
  if (error) {
    return <div className="result-page" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>{error}</div>;
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
          {/* Render data dari State */}
          {careerMatches.map((career) => (
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
                  {/* Pastikan skills ada sebelum di-map untuk menghindari error */}
                  {career.skills && career.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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