const faker = require("faker");
const mongoose = require("mongoose");
const Post = require("./models/post");
const Review = require("./models/review");

// Connect the database
mongoose.connect("mongodb://127.0.0.1:27017/surfShopDB", {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connection Completed");
});

async function seedPosts() {
  await Review.deleteMany({});
  await Post.deleteMany({});
  for (const _ of new Array(40)) {
    const post = {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
      author: {
        _id: "623daccc9358384c32937c82",
        username: "asad",
      },
    };
    await Post.create(post);
  }
}

seedPosts();
