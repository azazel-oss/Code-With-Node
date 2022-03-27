const Review = require("../models/review");

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
};
