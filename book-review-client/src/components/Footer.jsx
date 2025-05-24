import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">BookReviews</h3>
            <p className="footer-description">
              Your go-to platform for discovering, reviewing, and discussing books.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/books">Browse Books</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Genres</h3>
            <ul className="footer-links">
              <li><Link to="/books?genre=fiction">Fiction</Link></li>
              <li><Link to="/books?genre=non-fiction">Non-Fiction</Link></li>
              <li><Link to="/books?genre=mystery">Mystery</Link></li>
              <li><Link to="/books?genre=science-fiction">Science Fiction</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} BookReviews. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
