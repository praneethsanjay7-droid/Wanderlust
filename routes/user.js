const express = require("express");
const router = express.Router();
const User = require("../Models/user"); // Capitalized
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveredirectUrl } = require("../middleware");
const userController=require("../controllers/user.js");


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.get("/logout",userController.Logout);


router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveredirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
   userController.Login)

//---logout route---

module.exports = router;
