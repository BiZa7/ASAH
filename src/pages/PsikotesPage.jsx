import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { psikotesService } from "../services/psikotesService";
import { optionCareer } from '../services/roadmapService'; 
import { QuestionCard } from "../components/QuestionCard"; 

import arrowright from "../assets/arrowright.svg";
import arrowleft from "../assets/arrowleft.svg";
import "./PsikotesPage.css";

export const PsikotesPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const originalStyle = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#F5F5F5";
    return () => {
      document.body.style.backgroundColor = originalStyle;
    };
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await psikotesService.getQuestions();

      if (response.status === 200 && response.data) {
        setQuestions(response.data);
        const initialAnswers = response.data.map((q) => ({
          id_user_question: q.id_user_question,
          id_question: q.id_question,
          type_question: q.type_question,
          answer: null,
        }));
        setAnswers(initialAnswers);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message || "Gagal memuat soal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerValue) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = {
      ...updatedAnswers[questionIndex],
      answer: answerValue,
    };
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter((a) => a.answer === null);
    if (unanswered.length > 0) {
      alert(`Masih ada ${unanswered.length} soal yang belum dijawab!`);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        user_answers: answers.map((ans) => ({
          id_user_question: ans.id_user_question,
          answer: ans.answer,
        })),
      };

      const result = await psikotesService.submitAnswers(payload);
      await optionCareer.getCareerRecommendation();

      if (result.success) {
        navigate("/results");
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      alert(`Gagal mengirim jawaban: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="psikotes-container">
        <div className="loading"><div className="spinner"></div><p>Memuat soal...</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="psikotes-container">
        <div className="error"><p>{error}</p><button onClick={fetchQuestions} className="retry-button">Coba Lagi</button></div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="psikotes-container">
        <div className="empty"><p>Tidak ada soal tersedia.</p><button onClick={() => navigate("/home")} className="back-button">Kembali ke Home</button></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  // --- LOGIC PROGRES BAR BARU ---
  // 1. Hitung jumlah jawaban yang sudah diisi (tidak null)
  const answeredCount = answers.filter((ans) => ans.answer !== null).length;
  
  // 2. Hitung persentase (Jumlah Terjawab / Total Soal * 100)
  // Gunakan 'questions.length || 1' untuk hindari pembagian dengan nol saat loading awal
  const progress = (answeredCount / (questions.length || 1)) * 100;

  return (
    <div className="psikotes-container">
      <div className="psikotes-header">
        <h1>Tes Psikologi</h1>
        <p className="description-text">
          Selesaikan penilaian OCEAN dan Aptitude untuk menerima rekomendasi
          karier yang dipersonalisasi.
        </p>
        <p className="progress-text">
          Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="question-type-badge">
          {currentQuestion.type_question}
        </div>
      </div>

      {/* --- WRAPPER BARU DIMULAI DI SINI --- */}
      <div className="psikotes-card-wrapper">
        
        {/* Component Pertanyaan */}
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={currentAnswer?.answer}
          onSelect={(val) => handleAnswerSelect(currentQuestionIndex, val)}
        />

        {/* Tombol Navigasi (Sekarang di dalam wrapper) */}
        <div className="navigation-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="nav-button prev-button"
          >
            <img src={arrowleft} alt="Arrow Left" className="btn-icon" />
            Sebelumnya
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={answers.some((a) => a.answer === null)}
            >
              Selesai ✓
            </button>
          ) : (
            <button onClick={handleNext} className="nav-button next-button">
              Selanjutnya
              <img src={arrowright} alt="Arrow Right" className="btn-icon" />
            </button>
          )}
        </div>
        
      </div> 
      {/* --- WRAPPER SELESAI --- */}

    </div>
  );
};