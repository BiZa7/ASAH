import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { quizService } from "../services/quizService"; // Pastikan path sesuai
import "./QuizPage.css";

// Icons & Assets
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Komponen Internal untuk menampilkan pertanyaan (Pengganti QuestionCard)
const QuestionDisplay = ({
  question,
  selectedAnswer,
  onSelect,
  questionNumber,
}) => {
  return (
    <div className="question-card">
      <h3 className="question-text-heading">
        <span className="q-number">{questionNumber}.</span> {question.question}
      </h3>
      <div className="options-list">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          return (
            <div
              key={opt.key}
              className={`option-button ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(opt.key)}
            >
              <span className="opt-key">{opt.key}</span>
              <span className="opt-text">{opt.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id_roadmap_item } = useParams();

  // Ambil Data ID (Logic dari 'sekarang')
  const roadmapId = location.state?.roadmapId || id_roadmap_item;

  // --- STATE ---
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Format: { 0: 'A', 1: 'B' }
  const [isFinished, setIsFinished] = useState(false);

  // State untuk hasil (Logic dari 'awal' + 'sekarang')
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // --- FETCH DATA (Logic dari 'sekarang') ---
  useEffect(() => {
    if (!roadmapId) {
      setError("ID Materi tidak ditemukan. Silakan kembali ke roadmap.");
      setLoading(false);
      return;
    }

    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await quizService.getQuizByRoadmapId(roadmapId);
        const rawData = response.data.questions || response.data || [];

        if (rawData.length > 0) {
          const formattedQuestions = rawData.map((q) => ({
            id: q.id_quiz || Math.random(),
            question: q.question,
            options: [
              { key: "A", text: q.opsi_a },
              { key: "B", text: q.opsi_b },
              { key: "C", text: q.opsi_c },
              { key: "D", text: q.opsi_d },
            ],
            correctAnswer: q.correct_answer,
          }));
          setQuestions(formattedQuestions);
        } else {
          setError("Kuis belum tersedia untuk materi ini.");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Gagal memuat kuis. Pastikan server berjalan.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [roadmapId]);

  // --- HANDLERS ---
  const handleAnswerSelect = (key) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: key,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const calculatedScore = (correct / questions.length) * 100;
    setCorrectCount(correct);
    setScore(calculatedScore);
    setIsFinished(true);

    await quizService.submitQuiz(roadmapId, calculatedScore);
  };

  const handleRetry = async () => {
    // A. RESET UI KE MODE LOADING SEGERA
    setLoading(true); // Munculkan spinner Loader2
    setIsFinished(false); // Hilangkan halaman Result
    setError(null);

    // B. RESET STATE KUIS
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);

    // C. GENERATE ULANG (Tunggu sampai selesai)
    await quizService.generateQuiz(roadmapId);

    // D. AMBIL DATA BARU (Tunggu sampai selesai)
    // Fungsi ini akan melakukan fetch dan di akhirnya melakukan setLoading(false)
    await fetchQuestions();
  };

  const handleBackToRoadmap = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  // --- LOADING & ERROR VIEW ---
  if (loading) {
    return (
      <div className="quiz-page-wrapper center-content">
        <Loader2 className="animate-spin" size={48} color="#0B4251" />
        <p style={{ marginTop: 10, color: "#666" }}>Menyiapkan soal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page-wrapper center-content">
        <AlertCircle size={64} color="#EF4444" />
        <h3>Terjadi Kesalahan</h3>
        <p>{error}</p>
        <button
          className="btn-primary"
          onClick={handleBackToRoadmap}
          style={{ marginTop: 20 }}
        >
          Kembali
        </button>
      </div>
    );
  }

  // --- CALCULATIONS FOR UI ---
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const currentQ = questions[currentQuestionIndex];
  const isLast = currentQuestionIndex === questions.length - 1;

  // --- RENDER RESULT VIEW (UI dari 'awal') ---
  if (isFinished) {
    let resultType = "";
    let resultImage = null;
    let title = "";
    let subtitle = "";

    if (score >= 60) {
      resultType = "pass";
      resultImage = <CheckCircle size={80} color="#22C55E" fill="#DCFCE7" />;
      title = score === 100 ? "Sempurna!" : "Kerja Bagus!";
      subtitle = "Kamu telah berhasil menyelesaikan kuis modul ini!";
    } else {
      resultType = "fail";
      resultImage = <AlertCircle size={80} color="#EF4444" fill="#FEE2E2" />;
      title = "Jangan Menyerah!";
      subtitle =
        "Kamu membutuhkan nilai 60% untuk lulus. Pelajari kembali materi dan coba lagi.";
    }

    return (
      <div className="quiz-page-wrapper">
        <div className="outcome-card">
          <div className="outcome-icon">{resultImage}</div>
          <h2 className="outcome-title">{title}</h2>
          <p className="outcome-subtitle">{subtitle}</p>

          <div className="score-box">
            <div className="score-number">
              {correctCount}/{questions.length}
            </div>
            <div className="score-label">{Math.round(score)}% Benar</div>
          </div>

          <div className="stats-grid">
            <div className="stat-item green">
              <span className="stat-val">{correctCount}</span>
              <span className="stat-lbl">Benar</span>
            </div>
            <div className="stat-item red">
              <span className="stat-val">
                {questions.length - correctCount}
              </span>
              <span className="stat-lbl">Salah</span>
            </div>
            <div className="stat-item grey">
              <span className="stat-val">{answeredCount}</span>
              <span className="stat-lbl">Terjawab</span>
            </div>
          </div>

          <div className="outcome-actions">
            <button className="btn-outline" onClick={handleRetry}>
              <RotateCcw size={18} /> Ulang Kuis
            </button>
            <button className="btn-primary" onClick={handleBackToRoadmap}>
              {resultType === "fail" ? "Pelajari Materi" : "Lanjut Belajar"}{" "}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN QUIZ (UI dari 'awal') ---
  return (
    <div className="quiz-page-wrapper">
      <div className="quiz-header-simple">
        <img src="/AsahLogo.svg" alt="Logo" style={{ height: "40px" }} />{" "}
        {/* Sesuaikan path logo */}
        <div className="question-counter-badge">
          {currentQuestionIndex + 1}/{questions.length} Pertanyaan
        </div>
      </div>

      <div className="quiz-content-container">
        {/* WRAPPER BARU (Sesuai desain 'awal') */}
        <div className="quiz-card-wrapper">
          {/* 1. PROGRESS BAR */}
          <div className="quiz-progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 2. Komponen Pertanyaan (Custom Internal Component) */}
          <QuestionDisplay
            question={currentQ}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            onSelect={handleAnswerSelect}
            questionNumber={currentQuestionIndex + 1}
          />

          {/* 3. Navigasi */}
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
                disabled={answeredCount < questions.length} // Disable jika belum semua terjawab
              >
                Selesai <ArrowRight size={18} />
              </button>
            ) : (
              <button className="nav-btn next" onClick={handleNext}>
                Selanjutnya <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
        {/* AKHIR WRAPPER */}
      </div>
    </div>
  );
};
