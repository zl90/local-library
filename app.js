var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv/config");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");
const helmet = require("helmet");

var app = express();

// Helmet helps protect your app from well-known web vulnerabilities.
app.use(helmet());

// Set up Mongoose connection
const mongoose = require("mongoose");
var dev_db_url =
  "mongodb+srv://zl95:lol123@cluster0.mgj4u2b.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url; // connection string is stored in environment
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }); // Sets up the default db connection.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: ")); // Allows db errors to be printed to console.

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
