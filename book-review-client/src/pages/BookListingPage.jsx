import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchBooks } from '../services/api';
import BookCard from '../components/BookCard';

const BookListingPage = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0
  });

  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || '';

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await fetchBooks(page, 10, search, genre);
        
        setBooks(response.data);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalBooks: response.count
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load books');
        setLoading(false);
        console.error(err);
      }
    };

    loadBooks();
  }, [page, search, genre]);

  const genreOptions = [
    'All Genres',
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

  const generatePaginationLinks = () => {
    const links = [];
    
    links.push(
      <a
        key="prev"
        href={`/books?page=${Math.max(1, pagination.currentPage - 1)}&search=${search}&genre=${genre}`}
        className={`page-link ${pagination.currentPage === 1 ? 'disabled' : ''}`}
      >
        &laquo; Previous
      </a>
    );
    
    for (let i = 1; i <= pagination.totalPages; i++) {
      if (
        i === 1 ||
        i === pagination.totalPages ||
        (i >= pagination.currentPage - 1 && i <= pagination.currentPage + 1)
      ) {
        links.push(
          <a
            key={i}
            href={`/books?page=${i}&search=${search}&genre=${genre}`}
            className={`page-link ${pagination.currentPage === i ? 'active' : ''}`}
          >
            {i}
          </a>
        );
      } else if (
        i === pagination.currentPage - 2 ||
        i === pagination.currentPage + 2
      ) {
        links.push(<span key={i} className="ellipsis">...</span>);
      }
    }
    
    links.push(
      <a
        key="next"
        href={`/books?page=${Math.min(pagination.totalPages, pagination.currentPage + 1)}&search=${search}&genre=${genre}`}
        className={`page-link ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}
      >
        Next &raquo;
      </a>
    );
    
    return links;
  };

  return (
    <div className="book-listing-page">
      <div className="container">
        <div className="book-listing-header">
          <h1 className="page-title">
            {search
              ? `Search Results for "${search}"`
              : genre
              ? `${genre.charAt(0).toUpperCase() + genre.slice(1)} Books`
              : 'All Books'}
          </h1>
        </div>

        <div className="book-listing-content">
          <aside className="filter-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">Genres</h3>
              <ul className="genre-list">
                {genreOptions.map((genreOption) => (
                  <li key={genreOption}>
                    <a
                      href={`/books?genre=${genreOption === 'All Genres' ? '' : genreOption.toLowerCase().replace(' ', '-')}`}
                      className={`genre-link ${
                        (genreOption === 'All Genres' && !genre) ||
                        genre === genreOption.toLowerCase().replace(' ', '-')
                          ? 'active'
                          : ''
                      }`}
                    >
                      {genreOption}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="book-grid-container">
            {loading ? (
              <div className="loading">Loading books...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : books.length === 0 ? (
              <div className="no-results">
                <p>No books found. Try a different search or filter.</p>
              </div>
            ) : (
              <>
                <div className="books-grid">
                  {books.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>

                <div className="pagination">
                  {generatePaginationLinks()}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookListingPage;
