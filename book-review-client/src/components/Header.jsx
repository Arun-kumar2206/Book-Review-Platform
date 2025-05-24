import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>BookReviews</h1>
          </Link>
          
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
            <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/books" className="nav-link">Books</Link>
              </li>
              
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/add-book" className="nav-link">Add Book</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`/profile/${currentUser._id}`} className="nav-link">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                  </li>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
