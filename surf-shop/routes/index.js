const express = require("express");
const router = express.Router();
const {
  landingPage,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
} = require("../controllers/index");
// You can omit '/index' because javascript is smart enough to use index file
const { asyncErrorHandler, isLoggedIn } = require("../middleware/index");

/* GET home page. */
router.get("/", asyncErrorHandler(landingPage));

/* GET register page. */
router.get("/register", getRegister);

/* POST register page. */
router.post("/register", asyncErrorHandler(postRegister));

/* GET login. */
router.get("/login", getLogin);

/* POST login. */
router.post("/login", asyncErrorHandler(postLogin));

/* GET logout */
router.get("/logout", getLogout);

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

/* PUT forgot-password/:token. */
router.put("/forgot", (req, res, next) => {
  res.send("PUT /forgot");
});

/* GET reset-password/:token. */
router.get("/reset/:token", (req, res, next) => {
  res.send("GET /reset/:token");
});

/* PUT reset-password. */
router.put("/reset-pw/:token", (req, res, next) => {
  res.send("PUT /reset-pw/:token");
});
module.exports = router;
