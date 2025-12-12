import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import './QuizPage.css';

// Icons & Assets
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

export const QuizPage = () => {
  const navigate = useNavigate();

  // Mock Data Soal
  const questions = [
    {
      id_question: 1,
      type_question: 'Aptitude', 
      question: "Manakah formula Excel yang digunakan untuk menjumlahkan data?",
      optionA: "SUM",
      optionB: "COUNT",
      optionC: "AVERAGE",
      optionD: "MAX",
      correctAnswer: "SUM"
    },
    // ... (soal-soal lainnya) ...
    {
      id_question: 2,
      type_question: 'Aptitude',
      question: "Apa fungsi dari VLOOKUP?",
      optionA: "Mencari data secara horizontal",
      optionB: "Mencari data secara vertikal",
      optionC: "Menghitung rata-rata",
      optionD: "Membuat grafik",
      correctAnswer: "Mencari data secara vertikal"
    },
    {
      id_question: 3,
      type_question: 'Aptitude',
      question: "Shortcut untuk menyimpan file adalah...",
      optionA: "Ctrl + C",
      optionB: "Ctrl + V",
      optionC: "Ctrl + S",
      optionD: "Ctrl + P",
      correctAnswer: "Ctrl + S"
    },
    {
      id_question: 4,
      type_question: 'Aptitude',
      question: "Simbol apa yang digunakan untuk memulai formula di Excel?",
      optionA: "#",
      optionB: "$",
      optionC: "/",
      optionD: "=",
      correctAnswer: "="
    },
    {
      id_question: 5,
      type_question: 'Aptitude',
      question: "Ekstensi file standar untuk Excel modern adalah...",
      optionA: ".doc",
      optionB: ".xlsx",
      optionC: ".ppt",
      optionD: ".txt",
      correctAnswer: ".xlsx"
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });

    setCorrectCount(correct);
    setScore((correct / questions.length) * 100);
    setIsFinished(true);
  };

  const handleRetry = () => {
    setAnswers(Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    setScore(0);
  };

  const handleBackToRoadmap = () => {
    navigate('/roadmap');
  };

  const answeredCount = answers.filter((ans) => ans !== null).length;

  const progress = (answeredCount / questions.length) * 100;

  if (isFinished) {
    let resultType = ''; 
    let resultImage = null;
    let title = '';
    let subtitle = '';

    if (correctCount === questions.length) {
      resultType = 'perfect';
      resultImage = <CheckCircle size={80} color="#22C55E" fill="#DCFCE7" />;
      title = "Kerja Bagus!";
      subtitle = "Kamu telah berhasil menyelesaikan kuis modul dengan sempurna!";
    } else if (score >= 60) { 
      resultType = 'pass';
      resultImage = <CheckCircle size={80} color="#22C55E" fill="#DCFCE7" />;
      title = "Kerja Bagus!";
      subtitle = "Kamu telah berhasil menyelesaikan kuis modul!";
    } else {
      resultType = 'fail';
      resultImage = <AlertCircle size={80} color="#EF4444" fill="#FEE2E2" />;
      title = "Jangan Menyerah!";
      subtitle = "Kamu membutuhkan nilai 60% untuk lulus. Pelajari kembali materi dan coba lagi.";
    }

    return (
      <div className="quiz-page-wrapper">
        <div className="outcome-card">
          <div className="outcome-icon">
             {resultImage}
          </div>
          <h2 className="outcome-title">{title}</h2>
          <p className="outcome-subtitle">{subtitle}</p>
          <div className="score-box">
            <div className="score-number">
              {correctCount}/{questions.length}
            </div>
            <div className="score-label">
              {Math.round(score)}% Benar
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-item green">
              <span className="stat-val">{correctCount}</span>
              <span className="stat-lbl">Benar</span>
            </div>
            <div className="stat-item red">
              <span className="stat-val">{questions.length - correctCount}</span>
              <span className="stat-lbl">Salah</span>
            </div>
            <div className="stat-item grey">
              <span className="stat-val">{answers.filter(a => a !== null).length}</span>
              <span className="stat-lbl">Terjawab</span>
            </div>
          </div>
          <div className="outcome-actions">
            <button className="btn-outline" onClick={handleRetry}>
              <RotateCcw size={18} /> Ulang Kuis
            </button>
            <button className="btn-primary" onClick={handleBackToRoadmap}>
              {resultType === 'fail' ? "Pelajari Materi" : "Lanjut Belajar"} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const isLast = currentQuestionIndex === questions.length - 1;

  return (
    <div className="quiz-page-wrapper">
        <div className="quiz-header-simple">
            <img src="/AsahLogo.svg" alt="Logo" style={{ height: '100px' }} />
            <div className="question-counter-badge">
                {currentQuestionIndex + 1}/{questions.length} Pertanyaan
            </div>
        </div>

        <div className="quiz-content-container">
            
            {/* --- WRAPPER BARU: Menyatukan Card & Navigasi --- */}
            <div className="quiz-card-wrapper">
                
                {/* 1. PROGRESS BAR (BARU DITAMBAHKAN) */}
                <div className="quiz-progress-section">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* 2. Komponen Pertanyaan */}
                <QuestionCard 
                    question={currentQ}
                    selectedAnswer={answers[currentQuestionIndex]}
                    onSelect={handleAnswerSelect}
                    questionNumber={currentQuestionIndex + 1} // Kirim nomor soal
                />

                {/* 3. Navigasi (Sekarang di dalam wrapper yang sama) */}
                <div className="quiz-navigation">
                    <button 
                        className="nav-btn prev"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ArrowLeft size={18} /> Sebelumnya
                    </button>

                    {isLast ? (
                        <button 
                            className="nav-btn finish"
                            onClick={handleSubmit}
                            disabled={answers.some(a => a === null)} 
                        >
                            Selesai <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button 
                            className="nav-btn next"
                            onClick={handleNext}
                        >
                            Selanjutnya <ArrowRight size={18} />
                        </button>
                    )}
                </div>

            </div>
            {/* --- AKHIR WRAPPER --- */}

        </div>
    </div>
  );
};