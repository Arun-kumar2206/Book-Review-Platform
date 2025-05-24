import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const res = await axios.get('http://localhost:5000/api/auth/me');
          
          if (res.data.success) {
            setCurrentUser(res.data.data);
          } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setCurrentUser(res.data.data);
        
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setCurrentUser(res.data.data);
        
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    
    delete axios.defaults.headers.common['Authorization'];
    
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
