const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

/**
 * The schema for Author documents.
 * The schema defines an author as having `String` SchemaTypes for the first
 * and last names (required, with a maximum of 100 characters), and `Date`
 * fields for the dates of birth and death.
 */
const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

/**
 * A virtual value for the Author's full name. (not stored in the DB)
 */
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  var fullname = "";
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ", " + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

/**
 * A virtual value for the Author's lifespan. (not stored in the DB)
 */
AuthorSchema.virtual("lifespan").get(() => {
  let lifetime_string = "";
  if (this.date_of_birth) {
    lifetime_string = this.date_of_birth.getYear().toString();
  }
  lifetime_string += " - ";
  if (this.date_of_death) {
    lifetime_string += this.date_of_death.getYear();
  }
  return lifetime_string;
});

/**
 * A virtual value for the Author's URL (not stored in the DB).
 * This returns the absolute URL required to get a particular instance of the
 * model --> we'll use the property in our templates whenever we need to get
 * a link to the particular author.
 */
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// Make the date of birth look nicer
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});

// Make the date of death look nicer
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

module.exports = mongoose.model("Author", AuthorSchema);
