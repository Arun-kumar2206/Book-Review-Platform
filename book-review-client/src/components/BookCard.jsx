import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <Link to={`/books/${book._id}`}>
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
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(book.averageRating) ? "star filled" : "star"}>★</span>
              ))}
            </span>
            <span className="rating-value">{book.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    averageRating: PropTypes.number,
  }).isRequired,
};

export default BookCard;
