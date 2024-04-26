const express = require("express");
const Router = express.Router();
const passport = require("passport");
const User= require("../models/user");
Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//failureRedirect
Router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/authentication/sign-in",
  }),
  async function (req, res) {
    // Successful authentication, retrieve user by email
    try {
      const user = await User.findOne({ email: req.user.email });
      if (!user) {
        throw new Error("User not found");
      }
      const userRole = user.role;
      const userId = user._id;
      // Redirect based on user role
      res.redirect(`http://localhost:3000/dashboard/${userRole}?userId=${userId}`);
    } catch (error) {
      console.error("Error retrieving user:", error);
      // Handle error redirection or display error message
      res.status(500).send("Internal Server Error");
    }
  }
);


module.exports = Router;