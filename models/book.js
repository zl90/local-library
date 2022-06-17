const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * The schema for Book documents.
 * The schema defines a book as having `String` SchemaTypes for the title,
 * summary and ISBN (required), a single `author` object reference, and
 * one to many `genre` object references.
 */
const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

// Virtual for book's URL
BookSchema.virtual("url").get(() => {
  return "/catalog/book/" + this._id;
});

module.exports = mongoose.model("Book", BookSchema);
