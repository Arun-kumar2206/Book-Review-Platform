const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    if (!req.query.bookId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a book ID'
      });
    }

    const book = await Book.findById(req.query.bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ book: req.query.bookId })
      .populate({
        path: 'user',
        select: 'username profilePicture'
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ book: req.query.bookId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    const book = await Book.findById(req.body.book);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    const existingReview = await Review.findOne({
      user: req.body.user,
      book: req.body.book
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this book'
      });
    }
    
    const review = await Review.create(req.body);
    
    res.status(201).json({
      success: true,
      data: review
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
