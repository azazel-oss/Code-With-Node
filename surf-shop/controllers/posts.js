require("dotenv").config();
const Post = require("../models/post");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const { cloudinary } = require("../cloudinary");

module.exports = {
  async postIndex(req, res, next) {
    let posts = await Post.paginate(
      {},
      {
        page: req.query.page || 1,
        limit: 10,
        sort: "-_id",
      }
    );
    res.render("posts/index", {
      title: "Posts",
      posts,
      mapBoxToken: process.env.MAPBOX_TOKEN,
    });
  },

  postNew(req, res, next) {
    res.render("posts/new", { title: "New post" });
  },

  async postCreate(req, res, next) {
    req.body.post.images = [];
    for (const file of req.files) {
      req.body.post.images.push({
        path: file.path,
        filename: file.filename,
      });
    }
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 1,
      })
      .send();

    req.body.post.geometry = response.body.features[0].geometry;
    let post = new Post(req.body.post);
    post.properties.description = `<strong><a href="/posts/${post._id}">${
      post.title
    }</a></strong><p>${post.location}</p><p>${post.description.substring(
      0,
      20
    )}...</p>`;
    await post.save();
    req.session.success = "Post created successfully";
    // req.flash("success", "Post created successfully");
    res.redirect(`/posts/${post.id}`);
  },

  async postShow(req, res, next) {
    let post = await Post.findById(req.params.id).populate({
      path: "reviews",
      options: { sort: { _id: -1 } },
      populate: {
        path: "author",
        model: "User",
      },
    });
    let floorRating = post.calculateAvgRating();
    res.render("posts/show", {
      post,
      floorRating,
      mapBoxToken: process.env.MAPBOX_TOKEN,
    });
  },

  async postEdit(req, res, next) {
    let post = await Post.findById(req.params.id);
    res.render("posts/edit", { post });
  },

  async postUpdate(req, res, next) {
    let post = await Post.findById(req.params.id);

    if (req.body.deleteImages && req.body.deleteImages.length) {
      let deleteImages = req.body.deleteImages;
      for (const filename of deleteImages) {
        await cloudinary.uploader.destroy(filename.trim());
        for (const image of post.images) {
          if (image.filename === filename.trim()) {
            let index = post.images.indexOf(image);
            post.images.splice(index, 1);
          }
        }
      }
    }
    if (req.files) {
      for (const file of req.files) {
        post.images.push({
          path: file.path,
          filename: file.filename,
        });
      }
    }
    if (req.body.post.location !== post.location) {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.post.location,
          limit: 1,
        })
        .send();

      post.geometry = response.body.features[0].geometry;
      post.location = req.body.post.location;
    }
    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;

    post.properties.description = `<strong><a href="/posts/${post._id}">${
      post.title
    }</a></strong><p>${post.location}</p><p>${post.description.substring(
      0,
      20
    )}...</p>`;
    await post.save();
    res.redirect(`/posts/${post.id}`);
  },

  async postDestroy(req, res, next) {
    let post = await Post.findByIdAndDelete(req.params.id);
    for (const image of post.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
    req.session.success = "Post deleted successfully!";
    res.redirect("/posts");
  },
};
