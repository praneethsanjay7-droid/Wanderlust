const Listing=require("../Models/listing.js");
const Review=require("../Models/review.js");
const ExpressError=require("../utils/ExpressError.js");

module.exports.createReview=async (req,res)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  let newReview = new Review(req.body.review);

  newReview.author=req.user._id;
  listing.reviews.push(newReview);
  req.flash("success","new review created");
    console.log(newReview);
  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview=async (req,res)=>{
  let { id, reviewId } = req.params;
  const deletedReview = await Review.findByIdAndDelete(reviewId);
  if(!deletedReview){
    req.flash("error","Review not found");
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success","review deleted");

  res.redirect(`/listings/${id}`);
}