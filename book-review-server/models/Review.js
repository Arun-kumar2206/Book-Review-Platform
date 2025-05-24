const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for your review'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add review content'],
    maxlength: [1000, 'Review cannot be more than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function(bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId }
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Book').findByIdAndUpdate(bookId, {
      averageRating: stats.length > 0 ? stats[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.book);
});

reviewSchema.pre('remove', function() {
  this.constructor.calculateAverageRating(this.book);
});

module.exports = mongoose.model('Review', reviewSchema);
