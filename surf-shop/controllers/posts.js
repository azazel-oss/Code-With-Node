const Post = require("../models/post");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "anythingthatworks",
  api_key: "686188685332888",
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = {
  async postIndex(req, res, next) {
    let posts = await Post.find({});
    res.render("posts/index", { posts });
  },

  postNew(req, res, next) {
    res.render("posts/new");
  },

  async postCreate(req, res, next) {
    req.body.post.images = [];
    for (const file of req.files) {
      let image = await cloudinary.v2.uploader.upload(file.path);
      req.body.post.images.push({
        url: image.secure_url,
        public_id: image.public_id,
      });
    }
    let post = await Post.create(req.body.post);
    res.redirect(`/posts/${post.id}`);
  },

  async postShow(req, res, next) {
    let post = await Post.findById(req.params.id);
    res.render("posts/show", { post });
  },

  async postEdit(req, res, next) {
    let post = await Post.findById(req.params.id);
    res.render("posts/edit", { post });
  },

  async postUpdate(req, res, next) {
    let post = await Post.findById(req.params.id);

    if (req.body.deleteImages && req.body.deleteImages.length) {
      let deleteImages = req.body.deleteImages;
      for (const public_id of deleteImages) {
        await cloudinary.v2.uploader.destroy(public_id.trim());
        for (const image of post.images) {
          if (image.public_id === public_id.trim()) {
            let index = post.images.indexOf(image);
            post.images.splice(index, 1);
          }
        }
      }
    }
    if (req.files) {
      for (const file of req.files) {
        let image = await cloudinary.v2.uploader.upload(file.path);
        post.images.push({
          url: image.secure_url,
          public_id: image.public_id,
        });
      }
    }
    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.location = req.body.post.location;
    post.save();

    res.redirect(`/posts/${post.id}`);
  },

  async postDestroy(req, res, next) {
    let post = await Post.findByIdAndDelete(req.params.id);
    for (const image of post.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    res.redirect("/posts");
  },
};
