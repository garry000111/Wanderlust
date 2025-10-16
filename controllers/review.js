const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.create = async(req,res) =>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listing/${listing._id}`);
}

module.exports.delete = async (req,res) =>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listing/${id}`);
}