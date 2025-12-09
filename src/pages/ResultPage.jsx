import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';
// Import icon panah kamu jika ingin dipakai di tombol bawah
import trophy from "../assets/trophy.svg";
import arrowright from "../assets/arrowright.svg"; 
import barchart from "../assets/barchart.svg";

export const ResultPage = () => {
  const navigate = useNavigate();

  // Data Dummy untuk meniru desain
  const careerMatches = [
    {
      id: 1,
      title: "Data Analyst",
      percentage: 92,
      description: "Analisis kumpulan data kompleks untuk membantu perusahaan membuat keputusan bisnis yang tepat. Bekerja dengan Statistical Tools dan Visualization Software.",
      skills: ["Python", "SQL", "Data Visualization", "Statistic", "Excel"]
    },
    {
      id: 2,
      title: "Data Scientist",
      percentage: 88,
      description: "Mengembangkan model machine learning dan algoritma canggih untuk memprediksi tren masa depan dan memecahkan masalah bisnis yang kompleks.",
      skills: ["Python", "Machine Learning", "Deep Learning", "Big Data", "Math"]
    },
    {
      id: 3,
      title: "Business Intelligence",
      percentage: 85,
      description: "Mengubah data mentah menjadi wawasan bisnis yang dapat ditindaklanjuti melalui dashboard interaktif dan pelaporan strategis.",
      skills: ["Tableau", "Power BI", "SQL", "Data Modeling", "Communication"]
    },
    {
      id: 4,
      title: "Data Engineer",
      percentage: 80,
      description: "Membangun dan memelihara arsitektur data, pipeline, dan sistem database untuk memastikan data tersedia dan siap dianalisis.",
      skills: ["ETL", "Cloud Computing", "Python", "Java", "Database Design"]
    },
    {
      id: 5,
      title: "Product Analyst",
      percentage: 78,
      description: "Menganalisis perilaku pengguna dan metrik produk untuk meningkatkan pengalaman pengguna dan mendorong pertumbuhan produk.",
      skills: ["Product Analytics", "A/B Testing", "SQL", "User Research", "Excel"]
    },
    {
      id: 6,
      title: "Statistician",
      percentage: 75,
      description: "Menerapkan teori dan metode statistik untuk mengumpulkan, menganalisis, dan menafsirkan data kuantitatif dalam berbagai industri.",
      skills: ["R", "SPSS", "Mathematics", "Probability", "Research"]
    }
  ];

  const handleGenerateRoadmap = () => {
    navigate('/roadmap');
  };

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
          {careerMatches.map((career) => (
            <div key={career.id} className="career-card">
              <div className="card-top">
                <div className="card-icon">
                  {/* Icon grafik placeholder */}
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