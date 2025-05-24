const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = {};
    
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const books = await Book.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Book.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: books.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: books
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'username profilePicture'
      }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
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
    
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
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
