const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/:id', protect, async (req, res) => {
  try {  
    const userWithReviews = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'book',
          select: 'title author coverImage'
        }
      });
    
    if (!userWithReviews) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: userWithReviews._id,
          username: userWithReviews.username,
          email: userWithReviews.email,
          profilePicture: userWithReviews.profilePicture,
          bio: userWithReviews.bio,
          createdAt: userWithReviews.createdAt
        },
        reviews: userWithReviews.reviews || []
      }
    });  } catch (err) {
    console.error('Error in GET /api/users/:id:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this profile'
      });
    }

    const { password, email, username, bio, profilePicture, ...otherFields } = req.body;
    
    const updateData = {
      ...(email && { email }),
      ...(username && { username }),
      ...(bio && { bio }),
      ...(profilePicture && { profilePicture })
    };

    if (Object.keys(otherFields).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid fields in request'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, 
        runValidators: true
      }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
});

module.exports = router;
