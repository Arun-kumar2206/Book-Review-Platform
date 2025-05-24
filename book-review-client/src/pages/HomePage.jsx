import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedBooks } from '../services/api';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        setLoading(true);
        const response = await fetchFeaturedBooks();
        setFeaturedBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load featured books');
        setLoading(false);
        console.error(err);
      }
    };

    loadFeaturedBooks();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Next Favorite Book</h1>
            <p className="hero-subtitle">
              Join our community of book lovers to explore, review, and share your reading experiences
            </p>
            <div className="hero-cta">
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-books">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Books</h2>
            <Link to="/books" className="view-all">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="loading">Loading featured books...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="books-grid">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="genres">
        <div className="container">
          <h2 className="section-title">Browse by Genre</h2>
          <div className="genres-grid">
            {['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Romance', 'Thriller', 'Self-Help'].map((genre) => (
              <Link
                key={genre}
                to={`/books?genre=${genre.toLowerCase().replace(' ', '-')}`}
                className="genre-card"
              >
                <h3>{genre}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
