const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Surf Shop - Home" });
});

/* GET register page. */
router.get("/register", (req, res, next) => {
  res.send("GET /register");
});

/* POST register page. */
router.post("/register", (req, res, next) => {
  res.send("POST /register");
});

/* GET login. */
router.get("/login", (req, res, next) => {
  res.send("GET /login");
});

/* POST login. */
router.post("/login", (req, res, next) => {
  res.send("POST /login");
});

/* GET profile. */
router.get("/profile", (req, res, next) => {
  res.send("GET /profile");
});

/* PUT profile/:user_id. */
router.put("/profile/:user_id", (req, res, next) => {
  res.send("PUT /profile/:user_id");
});

/* GET forgot-password. */
router.get("/forgot", (req, res, next) => {
  res.send("GET /forgot");
});

/* PUT forgot-password. */
router.put("/forgot", (req, res, next) => {
  res.send("PUT /forgot");
});

/* GET reset-password. */
router.get("/reset/:token", (req, res, next) => {
  res.send("GET /reset/:token");
});

/* PUT reset-password. */
router.put("/reset-pw/:token", (req, res, next) => {
  res.send("PUT /reset-pw/:token");
});
module.exports = router;
