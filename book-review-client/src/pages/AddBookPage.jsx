import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBookPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    coverImage: '',
    publicationYear: '',
    isbn: '',
    publisher: ''
  });

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Thriller',
    'Horror',
    'Biography',
    'History',
    'Self-Help',
    'Children'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.title || !formData.author || !formData.description || !formData.genre) {
        throw new Error('Please fill all required fields');
      }

      const bookData = {
        ...formData,
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : undefined
      };

      const response = await axios.post('http://localhost:5000/api/books', bookData);

      if (response.data.success) {
        navigate(`/books/${response.data.data._id}`);
      }
    } catch (err) {
      console.error('Error adding book:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'An error occurred while adding the book'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-book-page">
      <div className="container">
        <h1 className="page-title">Add New Book</h1>

        {error && (
          <div className="alert error">
            {Array.isArray(error) ? error.join(', ') : error}
          </div>
        )}

        <form className="book-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter book description"
              rows="5"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre.toLowerCase()}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="Enter URL to cover image"
            />
            {formData.coverImage && (
              <div className="image-preview">
                <img 
                  src={formData.coverImage} 
                  alt="Cover preview" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-book-cover.jpg';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="publicationYear">Publication Year</label>
              <input
                type="number"
                id="publicationYear"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                placeholder="Publication year"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="ISBN number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Enter publisher name"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
