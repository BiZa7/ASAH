import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { PsikotesPage } from './pages/PsikotesPage';
import { LandingPage } from './pages/LandingPage'; // 1. Import Landing Page
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
  
  // 2. Update Logika Header:
  // Header TIDAK muncul di '/login' DAN TIDAK muncul di '/' (Landing Page)
  const showHeader = location.pathname !== '/login' && location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />} 
      <Routes>
        {/* 3. Ubah Route root ('/') menjadi LandingPage */}
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
        
        {/* Opsional: Tangani halaman 404 atau redirect sembarang url ke landing page */}
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