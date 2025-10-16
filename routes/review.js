const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview , isLoggedIn} = require("../middleware.js");

const reviewController = require("../controllers/review.js");





//review
//post route
router.post("/",isLoggedIn,validateReview, wrapAsync (reviewController.create));


//delete route
router.delete("/:reviewId", wrapAsync(reviewController.delete));

module.exports = router;