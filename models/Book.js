// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    comments: { type: [String], default: [] },
  }
);

bookSchema.virtual('commentcount').get(function () {
  return Array.isArray(this.comments) ? this.comments.length : 0;
});

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Book || mongoose.model('Book', bookSchema);
