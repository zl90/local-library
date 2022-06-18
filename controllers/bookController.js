var Book = require("../models/book");
var Author = require("../models/author");
var Genre = require("../models/genre");
var BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");

var async = require("async");

/**
 * Controller for the Home page, which shows the total count of each category:
 */
exports.index = function (req, res) {
  // Search all the models to get the counts of all the Books, Instances,
  // Genres and Authors.
  // This is done in parallel, because we want all of the counts before
  // we render anything.
  async.parallel(
    {
      book_count: (callback) => {
        // Pass an empty object as a match condition to find all documents of
        // this collection:
        Book.countDocuments({}, callback);
      },
      book_instance_count: (callback) => {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: (callback) => {
        // Count all available book instances:
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count: (callback) => {
        Author.countDocuments({}, callback);
      },
      genre_count: (callback) => {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      // Send the data to the rendering engine (view).
      // The view's name is 'index'.
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

/**
 * Display a list of all the books.
 * Their title name is a hyperlink to their associated book detail page.
 */
exports.book_list = function (req, res, next) {
  // Searches for all books in the database, only returns their `title` and
  // `author` fields, we don't need the rest.
  Book.find({}, "title author")
    .sort({ title: 1 }) // Sort alphabetically by the title field.
    .populate("author") // Replace stored book author id with full author deets
    .exec((err, list_books) => {
      if (err) {
        return next(err);
      }
      // Successful, so render the list of books:
      res.render("book_list", { title: "Book List", book_list: list_books });
    });
};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      book_instance: function (callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }

      // Successful, so render
      res.render("book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

// Display book create form on GET.
exports.book_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST.
exports.book_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Book update POST");
};
