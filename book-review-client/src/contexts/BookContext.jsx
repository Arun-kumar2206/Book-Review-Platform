import { createContext, useContext, useState, useEffect } from 'react';
import { fetchFeaturedBooks } from '../services/api';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeaturedBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFeaturedBooks();
        setFeaturedBooks(response.data);
      } catch (err) {
        setError('Failed to fetch featured books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getFeaturedBooks();
  }, []);

  const value = {
    featuredBooks,
    loading,
    error,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};

export default BookContext;
