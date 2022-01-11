const passport = require("passport");
const User = require("../models/user");

module.exports = {
  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image,
    });
    await User.register(newUser, req.body.password);
    res.redirect("/");
  },

  postLogin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
    })(req, res, next);
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect("/");
  },
};
