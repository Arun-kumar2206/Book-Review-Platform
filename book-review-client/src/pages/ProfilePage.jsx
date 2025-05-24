import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { fetchUserProfile } from '../services/api';
import BookCard from '../components/BookCard';

const ProfilePage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('books');

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileData = await fetchUserProfile(id);
        
        if (profileData.success && profileData.data) {
          console.log('Profile data:', profileData.data); 
          setProfile(profileData.data.user);
          setUserReviews(profileData.data.reviews || []);
          setUserBooks([]);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!profile) {
    return <div className="error-container">User not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-image">
            <img 
              src={profile.profilePicture || '/default-avatar.jpg'} 
              alt={`${profile.username}'s profile`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.jpg';
              }}
            />
          </div>
          
          <div className="profile-details">            <h1 className="profile-username">{profile.username}</h1>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            <p className="profile-joined">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Books ({userBooks.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({userReviews.length})
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'books' && (
            <div className="profile-books">
              {userBooks.length === 0 ? (
                <p className="no-content">No books added yet</p>
              ) : (
                <div className="books-grid">
                  {userBooks.map(book => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="profile-reviews">
              {userReviews.length === 0 ? (
                <p className="no-content">No reviews written yet</p>
              ) : (
                <div className="reviews-list">
                  {userReviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <Link to={`/books/${review.book._id}`} className="book-title">
                          {review.book.title}
                        </Link>
                        <div className="review-rating">
                          {review.rating} ★
                        </div>
                      </div>
                      <div className="review-content">
                        <p>{review.text}</p>
                      </div>
                      <div className="review-date">
                        Posted on {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
