const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const PostSchema = new Schema({
  title: String,
  price: String,
  description: String,
  images: [{ url: String, public_id: String }],
  location: String,
  coordinates: Array,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

PostSchema.post("findOneAndDelete", async function (document) {
  await Review.deleteMany({
    _id: {
      $in: document.reviews,
    },
  });
});

module.exports = mongoose.model("Post", PostSchema);
