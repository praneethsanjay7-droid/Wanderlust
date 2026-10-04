const express=require("express");
const router=express.Router({mergeParams:true});


const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const listingSchema=require("../schema.js");
const reviewSchema=require("../schema.js").reviewSchema;

const Listing = require("../Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const Review=require("../Models/review.js");
const {validateReview, isLoggedIn,isAuthor}=require("../middleware.js")

const reviewController=require("../controllers/reviews.js");
//---------------Reviews -POST route--------------------

router.post("/", 
  isLoggedIn,
  validateReview, wrapAsync(reviewController.createReview));

//------------------detele review route-post route-------------------
router.delete("/:reviewId", 
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview));


module.exports=router;