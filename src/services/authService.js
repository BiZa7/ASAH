import api from '../utils/api';

export const authService = {
  // Login dengan Google
  googleLogin: async (code) => {
    try {
      const response = await api.post('/login/google/callback', { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Save tokens
  saveTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Save user data
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
};