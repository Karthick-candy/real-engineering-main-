// src/services/AuthService.js

const API_URL = 'http://localhost:8000/api';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/admin_login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ admin_email: email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('access', result.access);
      localStorage.setItem('refresh', result.refresh);
      return result;
    } else {
      throw new Error(result.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const verifyToken = async () => {
  const accessToken = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');

  if (!accessToken || !refreshToken) {
    throw new Error('Tokens are missing');
  }

  try {
    const response = await fetch(`${API_URL}/verify_token/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true; // Access token is valid
    } else if (response.status === 401) {
      // Token might be expired, try to refresh it
      const success = await refreshAccessToken(refreshToken);
      if (!success) {
        redirectToLogin(); // Redirect if refreshing failed
      }
      return success;
    } else {
      throw new Error('Token verification failed');
    }
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

// Renamed function to avoid confusion with the refresh token variable
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(`${API_URL}/refresh_token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('access', result.access);
      localStorage.setItem('refresh', result.refresh);
      return true; // Access token is refreshed successfully
    } else {
      throw new Error('Refresh token is invalid');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

const redirectToLogin = () => {
  window.location.href = '/admin-login'; // Change to your admin login URL
};