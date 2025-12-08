import React, { useState, useEffect } from 'react';
import { psikotesService } from '../services/psikotesService';
import { useNavigate } from 'react-router-dom';
import './PsikotesPage.css';

export const PsikotesPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  // Fetch questions saat component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await psikotesService.getQuestions();
    
    console.log('Response:', response);
    
    if (response.status === 200 && response.data) {
      setQuestions(response.data);
      
      // Initialize answers array dengan id_user_question dari response
      const initialAnswers = response.data.map(q => ({
        id_user_question: q.id_user_question, // ← GUNAKAN dari response
        id_question: q.id_question,
        type_question: q.type_question,
        answer: null
      }));
      setAnswers(initialAnswers);
    }
  } catch (err) {
    console.error('Error fetching questions:', err);
    setError(err.message || 'Gagal memuat soal. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};

  const handleAnswerSelect = (questionIndex, answerValue) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = {
      ...updatedAnswers[questionIndex],
      answer: answerValue
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
  // Validasi: pastikan semua soal sudah dijawab
  const unanswered = answers.filter(a => a.answer === null);
  if (unanswered.length > 0) {
    alert(`Masih ada ${unanswered.length} soal yang belum dijawab!`);
    return;
  }

  try {
    setLoading(true);
    
    // Format data sesuai yang diharapkan backend
    const formattedAnswers = answers.map((ans) => ({
      id_user_question: ans.id_user_question, // ← GUNAKAN id_user_question yang benar
      answer: ans.answer
    }));

    console.log('Sending answers:', formattedAnswers); // ← CEK di console

    const result = await psikotesService.submitAnswers(formattedAnswers);
    
    console.log('Submit result:', result);
    
    if (result.success) {
      alert('Psikotes berhasil diselesaikan!');
      navigate('/results');
    }
  } catch (err) {
    console.error('Error submitting test:', err);
    alert('Gagal mengirim jawaban. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="psikotes-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Memuat soal...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="psikotes-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchQuestions} className="retry-button">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!questions || questions.length === 0) {
    return (
      <div className="psikotes-container">
        <div className="empty">
          <p>Tidak ada soal tersedia.</p>
          <button onClick={() => navigate('/home')} className="back-button">
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Determine if question is OCEAN (Likert scale) or Aptitude (multiple choice)
  const isOceanQuestion = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'].includes(currentQuestion.type_question);

  return (
    <div className="psikotes-container">
      <div className="psikotes-header">
        <h1>Tes Psikologi - {currentQuestion.type_question}</h1>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Soal {currentQuestionIndex + 1} dari {questions.length}
        </p>
      </div>

      <div className="question-card">
        <div className="question-type-badge">
          {currentQuestion.type_question}
        </div>
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className="options-container">
          {isOceanQuestion ? (
            // OCEAN Questions: Likert Scale (1-5)
            <>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`option-button ${
                    currentAnswer?.answer === value ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, value)}
                >
                  <span className="option-value">{value}</span>
                  <span className="option-label">
                    {value === 1 && 'Sangat Tidak Setuju'}
                    {value === 2 && 'Tidak Setuju'}
                    {value === 3 && 'Netral'}
                    {value === 4 && 'Setuju'}
                    {value === 5 && 'Sangat Setuju'}
                  </span>
                </button>
              ))}
            </>
          ) : (
            // Aptitude Questions: Multiple Choice (A, B, C, D)
            <>
              {['A', 'B', 'C', 'D'].map((option) => (
                <button
                  key={option}
                  className={`option-button ${
                    currentAnswer?.answer === option ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                >
                  <span className="option-letter">{option}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Show explanation if available (only after answering) */}
        {currentAnswer?.answer && currentQuestion.explanation && (
          <div className="explanation">
            <h4>Penjelasan:</h4>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="nav-button prev-button"
        >
          ← Sebelumnya
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={answers.some(a => a.answer === null)}
          >
            Selesai ✓
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="nav-button next-button"
          >
            Selanjutnya →
          </button>
        )}
      </div>

      {/* Show answered count */}
      <div className="answer-summary">
        <p>
          Terjawab: <strong>{answers.filter(a => a.answer !== null).length}</strong> dari {questions.length}
        </p>
      </div>
    </div>
  );
};