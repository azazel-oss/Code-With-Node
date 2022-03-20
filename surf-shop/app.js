require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const flash = require("connect-flash");
const User = require("./models/user");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const session = require("express-session");
app.use(
  session({
    secret: "hang ten dude!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// require route
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const reviewsRouter = require("./routes/reviews");

// Connect the database
mongoose.connect("mongodb://127.0.0.1:27017/surfShopDB-mapbox", {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connection Completed");
});

// use ejs-locals for all ejs templates
app.engine("ejs", engine);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// // Setup connect flash for flash messages
// app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set local variables middleware
app.use(function (req, res, next) {
  // set default page title
  res.locals.title = "Surf Shop";

  // set success flash message
  res.locals.success = req.session.success || "";
  delete req.session.success;

  // set error flash message
  res.locals.error = req.session.error || "";
  delete req.session.error;

  // continue to the next function in the middleware chain
  next();
});

// Application routes
app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/reviews", reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render("error");

  console.log(err);
  req.session.error = err.message;
  // req.flash("error", "Something went wrong");
  res.redirect("back");
});
module.exports = app;
