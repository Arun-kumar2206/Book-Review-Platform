import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookById, fetchBookReviews, submitReview } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const BookDetailPage = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: '',
    content: '',
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const bookResponse = await fetchBookById(id);
        setBook(bookResponse.data);
        
        const reviewsResponse = await fetchBookReviews(id);
        setReviews(reviewsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load book details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookData();
  }, [id]);

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData({
      ...reviewFormData,
      [name]: value,
    });
  };  

  const validateReview = () => {
    const errors = [];
    if (!reviewFormData.rating) errors.push('Rating is required');
    if (!reviewFormData.title.trim()) errors.push('Title is required');
    if (!reviewFormData.content.trim()) errors.push('Review content is required');
    if (reviewFormData.title.length > 100) errors.push('Title must be less than 100 characters');
    if (reviewFormData.content.length > 1000) errors.push('Review must be less than 1000 characters');
    return errors;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !currentUser) {
      setReviewError('Please log in to submit a review');
      return;
    }

    // Validate form
    const validationErrors = validateReview();
    if (validationErrors.length > 0) {
      setReviewError(validationErrors.join(', '));
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError(null);
      
      const reviewData = {
        book: id,
        rating: parseInt(reviewFormData.rating),
        title: reviewFormData.title,
        content: reviewFormData.content,
      };
      
      await submitReview(reviewData);
      
      const reviewsResponse = await fetchBookReviews(id);
      setReviews(reviewsResponse.data);
      
      setReviewFormData({
        rating: 5,
        title: '',
        content: '',
      });
      
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
      
      setReviewSubmitting(false);
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
      setReviewSubmitting(false);
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.round(rating) ? "star filled" : "star"}>★</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!book) {
    return <div className="not-found">Book not found</div>;
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        <div className="book-header">
          <div className="book-cover">
            <img 
              src={book.coverImage} 
              alt={`${book.title} cover`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-book-cover.jpg';
              }}
            />
          </div>
          
          <div className="book-info">
            <h1 className="book-title">{book.title}</h1>
            <h2 className="book-author">by {book.author}</h2>
            
            <div className="book-meta">
              <div className="book-rating">
                {renderStars(book.averageRating)}
                <span className="rating-value">{book.averageRating.toFixed(1)}</span>
                <span className="reviews-count">({reviews.length} reviews)</span>
              </div>
              
              <div className="book-details">
                <p><strong>Genre:</strong> {book.genre}</p>
                {book.publicationYear && <p><strong>Published:</strong> {book.publicationYear}</p>}
                {book.publisher && <p><strong>Publisher:</strong> {book.publisher}</p>}
                {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="book-description">
          <h3>Description</h3>
          <p>{book.description}</p>
        </div>
        
        <div className="reviews-section">
          <h3>Reviews</h3>
          
          <div className="review-form-container">
            <h4>Write a Review</h4>
            
            {reviewSuccess && (
              <div className="alert success">Review submitted successfully!</div>
            )}
            
            {reviewError && (
              <div className="alert error">{reviewError}</div>
            )}
            
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  name="rating"
                  value={reviewFormData.rating}
                  onChange={handleReviewInputChange}
                  required
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Review Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={reviewFormData.title}
                  onChange={handleReviewInputChange}
                  required
                  placeholder="Summarize your thoughts"
                  maxLength="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Review Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={reviewFormData.content}
                  onChange={handleReviewInputChange}
                  required
                  placeholder="Share your experience with this book"
                  maxLength="1000"
                  rows="5"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
          
          <div className="reviews-list">            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="review-author">
                      <img
                        src={review.user.profilePicture}
                        alt={review.user.username}
                        className="author-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.jpg';
                        }}
                      />
                      <span className="author-name">{review.user.username}</span>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-content">{review.content}</p>
                  
                  <div className="review-footer">
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
