/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const Book = require('../models/Book');
module.exports = function (app) {

app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find();
        res.json(books);
      } catch (e) {
        res.status(500).send('server error');
      }
    })
    
    .post(async function (req, res){
      try {
        const title = req.body?.title;
        if (!title) return res.send('missing required field title');

        const book = await Book.create({ title });
        res.json({ _id: book._id, title: book.title });
      } catch (err) {
        res.status(500).send('server error');
      }
    })
    
    .delete(async function(req, res){
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('server error');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res){
      try {
        const bookid = req.params.id;
        if (!mongoose.isValidObjectId(bookid)) return res.send('no book exists');

        const book = await Book.findById(bookid, { __v: 0 }).lean();
        if (!book) return res.send('no book exists');

        res.json({ _id: book._id, title: book.title, comments: book.comments || [] });
      } catch (err) {
        res.status(500).send('server error');
      }
    })
    
    .post(async function(req, res){
      try {
        const bookid = req.params.id;
        const comment = req.body?.comment;

        if (!comment) return res.send('missing required field comment');
        if (!mongoose.isValidObjectId(bookid)) return res.send('no book exists');

        const book = await Book.findById(bookid);
        if (!book) return res.send('no book exists');

        book.comments.push(comment);
        await book.save();

        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (err) {
        res.status(500).send('server error');
      }
    })
    
    .delete(async function(req, res){
      try {
        const bookid = req.params.id;
        if (!mongoose.isValidObjectId(bookid)) return res.send('no book exists');

        const result = await Book.findByIdAndDelete(bookid);
        if (!result) return res.send('no book exists');

        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('server error');
      }
    });
  
};
