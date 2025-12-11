import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { PsikotesPage } from './pages/PsikotesPage';
import { LandingPage } from './pages/LandingPage';
import { ResultPage } from './pages/ResultPage';
import { RoadmapLoadingPage } from './pages/RoadmapLoadingPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ModulPage } from './pages/ModulPage';
import { QuizPage } from './pages/QuizPage';
import { Header } from './components/Header';
import { authService } from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

// Component untuk conditional rendering Header
const AppContent = () => {
  const location = useLocation();
  
  // Header TIDAK muncul di '/login', '/' (Landing), dan '/modul' (karena ModulPage punya header sendiri)
  const showHeader = location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/modul';

  return (
    <>
      {showHeader && <Header />} 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/psikotes" 
          element={
            <ProtectedRoute>
              <PsikotesPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/roadmap-loading" 
          element={
            <ProtectedRoute>
              <RoadmapLoadingPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/roadmap" 
          element={
            <ProtectedRoute>
              <RoadmapPage />
            </ProtectedRoute>
          } 
        />

        {/* 2. TAMBAHKAN ROUTE MODUL */}
        <Route 
          path="/modul" 
          element={
            <ProtectedRoute>
              <ModulPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;