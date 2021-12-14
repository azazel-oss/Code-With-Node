const express = require("express");
const router = express.Router();

/* GET posts index /posts */
router.get("/", (req, res, next) => {
  res.send("INDEX /posts");
});

/* GET posts new /posts/new */
router.get("/new", (req, res, next) => {
  res.send("NEW /posts/new");
});

/* POST posts create /posts */
router.post("/", (req, res, next) => {
  res.send("CREATE /posts");
});

/* GET posts new /posts/new */
router.get("/new", (req, res, next) => {
  res.send("NEW /posts/new");
});

/* GET posts edit /posts/:id/edit */
router.get("/:id/edit", (req, res, next) => {
  res.send("EDIT /posts/:id/edit");
});

/* PUT posts update /posts/:id */
router.put("/:id", (req, res, next) => {
  res.send("/posts/:id");
});

/* DELETE posts destroy /posts/:id */
router.delete("/:id", (req, res, next) => {
  res.send("/posts/:id");
});

module.exports = router;
