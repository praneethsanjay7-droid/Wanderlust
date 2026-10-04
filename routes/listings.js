const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const listingSchema=require("../schema.js");
const Listing = require("../Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const flash=require("connect-flash");
const crypto=require("crypto");
const { isLoggedIn } = require("../middleware.js");
const {isOwner}=require("../middleware.js");
const{validateListing}=require("../middleware.js")

const{storage}=require("../cloudConfig.js");


const multer=require("multer");
const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];


const upload=multer({storage:storage});

const setListingImage=(req,res,next)=>{
  if(req.file){
    req.body.listing ??= {};
    req.body.listing.image=req.file.path;
  }
  next();
};

const listingController=require("../controllers/listings.js");
//-----------------index route--------------------



router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single("listingImage"),
  setListingImage,
  validateListing,
  wrapAsync(listingController.createListing));

  router.get("/new",isLoggedIn,
  wrapAsync(listingController.rendernewForm));

  router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,
    isOwner, upload.single("listingImage"), setListingImage, validateListing,
  wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,
  wrapAsync(listingController.destroyListing));

//-----------------new route------------
// router.get("/new",isLoggedIn,
//   wrapAsync(listingController.rendernewForm));

//-----------------show route--------




//       const result=listingSchema.validate(req.body);

//     // let{title,description,image,price,location,country}=req.body;
//     //  let listing=req.body.listing;
//    if(!req.body.listing){
//     throw(new ExpressError(400,"send valid information for listing"))
//    }
    
// const newListing=new Listing(req.body.listing);
//   // if(!newListing.title){
//   //   throw(new ExpressError(400,"title is missing"))
//   //  }
//   //  if(!newListing.description){
//   //   throw(new ExpressError(400,"description is missing"))
//   //  }
//   //  if(!newListing.location){
//   //   throw(new ExpressError(400,"locatioin is missing"))
//   //  }
//   //  if(!newListing.price){
//   //   throw(new ExpressError(400,"price is missing"))
//   //  }
//   //  if(!newListing.country){
//   //   throw(new ExpressError(400,"country is missing"))
//   //  }
// console.log(result);
// if(result.error){
//   throw new ExpressError(400,result.error.message); 
// }
//     await newListing.save();
//     res.redirect("/listings");
//----------------edit route------------
router.get("/:id/edit",isLoggedIn,isOwner,
  wrapAsync(listingController.renderEditForm));


//--------------------delete route------------------



module.exports=router;