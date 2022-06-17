const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * The schema for Genre documents.
 * The Genre represents a set of books, it includes a name of `String` type
 * and is required, with a character range of 3-100 characters.
 */
const GenreSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
});

// A virtual for Genre's URL
GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

module.exports = mongoose.model("Genre", GenreSchema);
