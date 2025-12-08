import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#0B4251', minHeight: '100vh', color: 'white' }}>
      <h1>Welcome to Home Page!</h1>
      {user && (
        <div>
          <p>User: {user.name || user.email}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#F2C864',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  );
}
