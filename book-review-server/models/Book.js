const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre']
  },
  coverImage: {
    type: String,
    default: 'default-book-cover.jpg'
  },
  publicationYear: {
    type: Number
  },
  isbn: {
    type: String,
    unique: true
  },  
  publisher: {
    type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    set: val => Math.round(val * 10) / 10 
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book',
  justOne: false
});

module.exports = mongoose.model('Book', bookSchema);
