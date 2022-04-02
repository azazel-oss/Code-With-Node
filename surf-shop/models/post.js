const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const mongoosePaginate = require("mongoose-paginate");

const PostSchema = new Schema({
  title: String,
  price: String,
  description: String,
  images: [{ path: String, filename: String }],
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  properties: {
    description: String,
  },
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
  avgRating: {
    type: Number,
    default: 0,
  },
});

PostSchema.post("findOneAndDelete", async function (document) {
  await Review.deleteMany({
    _id: {
      $in: document.reviews,
    },
  });
});

PostSchema.methods.calculateAvgRating = function () {
  let ratingsTotal = 0;
  if (this.reviews.length) {
    this.reviews.forEach((review) => {
      ratingsTotal += review.rating;
    });
    this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
  } else {
    this.avgRating = ratingsTotal;
  }
  const floorRating = Math.floor(this.avgRating);
  this.save();
  return floorRating;
};

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", PostSchema);
