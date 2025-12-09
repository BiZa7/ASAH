import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { PsikotesPage } from './pages/PsikotesPage';
import { LandingPage } from './pages/LandingPage';
// 1. IMPORT PAGE BARU
import { ResultPage } from './pages/ResultPage';
import { RoadmapPage } from './pages/RoadmapPage';
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
  
  // Header TIDAK muncul di '/login' DAN TIDAK muncul di '/'
  const showHeader = location.pathname !== '/login' && location.pathname !== '/';

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
        
        {/* 2. TAMBAHKAN ROUTE HASIL (Protected karena butuh data user/tes) */}
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          } 
        />

        {/* 3. TAMBAHKAN ROUTE ROADMAP (Protected) */}
        <Route 
          path="/roadmap" 
          element={
            <ProtectedRoute>
              <RoadmapPage />
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