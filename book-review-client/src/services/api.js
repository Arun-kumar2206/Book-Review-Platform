import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchBooks = async (page = 1, limit = 10, search = '', genre = '') => {
  try {
    const response = await api.get('/books', {
      params: { page, limit, search, genre },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const fetchBookById = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book ${bookId}:`, error);
    throw error;
  }
};

export const fetchFeaturedBooks = async () => {
  try {
    const response = await api.get('/books', {
      params: { featured: true, limit: 5 },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured books:', error);
    throw error;
  }
};

export const fetchBookReviews = async (bookId, page = 1, limit = 10) => {
  try {
    const response = await api.get('/reviews', {
      params: { bookId, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for book ${bookId}:`, error);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const fetchUserProfile = async (userId) => {  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export default {
  fetchBooks,
  fetchBookById,
  fetchFeaturedBooks,
  fetchBookReviews,
  submitReview,
  fetchUserProfile,
  updateUserProfile,
};
