/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongodb');

chai.use(chaiHttp);
let books = [];

suite('Functional Tests', function () {

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            title: 'Learn Vietnamese 1'
          })
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.isTrue(ObjectId.isValid(res.body._id));
            assert.strictEqual(res.body.title, 'Learn Vietnamese 1');

            books.push({
              _id: res.body._id,
              title: res.body.title,
              comments: []
            });

            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.text, 'missing required field title');

            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.isArray(res.body);
            for (let i = 0; i < res.body.length; ++i) {
              assert.property(res.body[i], '_id');
              assert.property(res.body[i], 'title');
              assert.property(res.body[i], 'commentcount');
              assert.strictEqual(res.body[i]._id.toString(), books[i]._id.toString());
              assert.strictEqual(res.body[i].title, books[i].title);
              assert.strictEqual(res.body[i].commentcount, books[i].comments.length);
            };

            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/123456789012')
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.text, 'no book exists');

            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${books[0]._id}`)
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.strictEqual(res.body._id.toString(), books[0]._id.toString());
            assert.strictEqual(res.body.title, books[0].title);
            for (let i = 0; i < res.body.comments.length; ++i) {
              assert.strictEqual(res.body.comments[i], books[0].comments[i]);
            }

            done();
          });
      });
    });

  });


  suite('POST /api/books/[id] => add comment/expect book object with id', function () {

    test('Test POST /api/books/[id] with comment', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post(`/api/books/${books[0]._id}`)
        .send({ comment: 'Comment 1' })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments);
          assert.strictEqual(res.body._id.toString(), books[0]._id.toString());
          assert.strictEqual(res.body.title, books[0].title);
          for (let i = 0; i < res.body.comments.length; ++i) {
            if (i < res.body.comments.length - 1) {
              assert.strictEqual(res.body.comments[i], books[0].comments[i]);
            } else {
              assert.strictEqual(res.body.comments[i], 'Comment 1');
            }
          }

          books[0].comments.push('Comment 1');

          done();
        });
    });

    test('Test POST /api/books/[id] without comment field', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post(`/api/books/${books[0]._id}`)
        .send({})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'missing required field comment');

          done();
        });
    });

    test('Test POST /api/books/[id] with comment, id not in db', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post(`/api/books/123`)
        .send({})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'no book exists');

          done();
        });
    });

  });

  suite('DELETE /api/books/[id] => delete book object id', function () {

    test('Test DELETE /api/books/[id] with valid id in db', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete(`/api/books/${books[0]._id}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'delete successful');

          done();
        });
    });

    test('Test DELETE /api/books/[id] with  id not in db', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete(`/api/books/123`)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'no book exists');

          done();
        });
    });

  });

});
