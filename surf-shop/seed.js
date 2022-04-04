const faker = require("faker");
const mongoose = require("mongoose");
const Post = require("./models/post");
const Review = require("./models/review");
const cities = require("./cities");

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
  await Post.deleteMany({});
  await Review.deleteMany({});
  for (const _ of new Array(600)) {
    const random1000 = Math.floor(Math.random() * 1000);
    const title = faker.lorem.word();
    const description = faker.lorem.text();
    const postData = {
      title,
      description,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      author: "624a9ca12a5657e37914be8a",
    };
    let post = new Post(postData);
    post.properties.description = `<strong><a href="/posts/${
      post._id
    }">${title}</a></strong><p>${post.location}</p><p>${description.substring(
      0,
      20
    )}...</p>`;
    post.save();
  }
  console.log("600 new posts created");
}
seedPosts();
