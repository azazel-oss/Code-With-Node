require("dotenv").config();
const Post = require("../models/post");
const Review = require("../models/review");

module.exports = {
  async reviewCreate(req, res, next) {
    // We are only able to access this params.id here because we have merged
    // the parameters in our routers
    let post = await Post.findById(req.params.id).populate("reviews").exec();

    let hasReviewed = post.reviews.filter((review) =>
      review.author.equals(req.user._id)
    ).length;
    if (hasReviewed) {
      req.session.error = "You can create only one review per post!!!";
      return res.redirect(`/posts/${post.id}`);
    }
    req.body.review.author = req.user._id;
    let review = await Review.create(req.body.review);
    post.reviews.push(review);
    post.save();
    req.session.success = "Review created successfully!!!";
    res.redirect(`/posts/${post.id}`);
  },

  async reviewUpdate(req, res, next) {
    await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
    req.session.success = "Review updated successfully";
    res.redirect(`/posts/${req.params.id}`);
  },

  async reviewDestroy(req, res, next) {
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.review_id },
    });
    await Review.findByIdAndDelete(req.params.review_id);
    req.session.success = "Review deleted successfully";
    res.redirect(`/posts/${req.params.id}`);
  },
};
