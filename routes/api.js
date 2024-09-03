/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { ObjectId } = require('mongodb');

module.exports = function (app) {
  let books = [];

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let resBooks = [];
      books.forEach(book => {
        resBooks.push({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        });
      });
      res.json(resBooks);
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (title === undefined) {
        res.send('missing required field title');
      } else {
        let book = {
          _id: new ObjectId(),
          title: title,
          comments: []
        };
        books.push(book);
        res.json({
          _id: book._id,
          title: book.title
        });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      books = [];
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book = books.find(book => book._id.toString() === bookid);

      if (book === undefined) {
        res.send('no book exists');
      } else {
        res.json(book);
      }
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      let book = books.find(book => book._id.toString() === bookid);

      if (book === undefined) {
        res.send('no book exists');
      } else if (comment === undefined) {
        res.send('missing required field comment');
      } else {
        book.comments.push(comment);
        res.json(book);
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let book = books.find(book => book._id.toString() === bookid);

      if (book === undefined) {
        res.send('no book exists');
      } else {
        let index = books.indexOf(book);
        books.splice(index, 1);
        res.send('delete successful');
      }
    });

};
