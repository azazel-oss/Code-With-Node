const Review = require("../models/review");
const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
  asyncErrorHandler: (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },
  isReviewAuthor: async (req, res, next) => {
    let review = await Review.findById(req.params.review_id);

    // can also use req.user in place of res.locals.currentUser
    if (review.author.equals(res.locals.currentUser._id)) {
      return next();
    }
    req.session.error = "You are not authorised to change this review";
    return res.redirect("/");
  },
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.error = "You need to be logged in to perform this action";
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login");
  },
  isAuthor: async (req, res, next) => {
    let post = await Post.findById(req.params.id);
    console.log(post);
    if (post.author.equals(req.user._id)) {
      res.locals.post = post;
      return next();
    }
    req.session.error = "Access denied!";
    res.redirect("back");
  },
  isValidPassword: async (req, res, next) => {
    const { user } = await User.authenticate()(
      req.user.username,
      req.body.currentPassword
    );
    if (user) {
      res.locals.user = user;
      next();
    } else {
      req.session.error = "Invalid current password";
      return res.redirect("/profile");
    }
  },
  changePassword: async (req, res, next) => {
    const { newPassword, passwordConfirmation } = req.body;

    if (newPassword && !passwordConfirmation) {
      req.session.error = "Missing password confirmation!";
      return res.redirect("/profile");
    } else if (newPassword && passwordConfirmation) {
      const { user } = res.locals;
      if (newPassword === passwordConfirmation) {
        await user.setPassword(newPassword);
        next();
      } else {
        req.session.error = "New passwords must match!";
        return res.redirect("/profile");
      }
    } else {
      next();
    }
  },
};
