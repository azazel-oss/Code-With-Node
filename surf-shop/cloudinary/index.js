const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  // folder: "surf-shop",
  // allowedFormats: ["jpeg", "jpg", "png"],
  // filename: function (req, file, cb) {
  //   let buf = crypto.randomBytes(16);
  //   buf = buf.toString("hex");
  //   let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, "");
  //   uniqFileName += buf;
  //   cb(undefined, uniqFileName);
  // },
  params: {
    folder: "surf-shop",
    format: "jpeg",
    filename: function (req, file, cb) {
      let buf = crypto.randomBytes(16);
      buf = buf.toString("hex");
      let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, "");
      uniqFileName += buf;
      return uniqFileName;
    },
  },
});

module.exports = {
  cloudinary,
  storage,
};
