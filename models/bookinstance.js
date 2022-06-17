const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

/**
 * The schema for Book Instance documents.
 * The BookInstance represents a specific copy of a book that someone might
 * borrow and includes information about whether the copy is available, on
 * what date it is expected back, and "imprint" (or version) details.
 */
const BookInstanceSchema = new Schema({
  // Reference to the associated book:
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    // List of possible status values
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(() => {
  return "/catalog/bookinstance/" + this._id;
});

// Virtual for bookinstance's formatted date
BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("BookInstance", BookInstanceSchema);
