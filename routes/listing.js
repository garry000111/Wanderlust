const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, saveRedirectUrl, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing.js");


router.route("/")
//index route
.get(async (req,res) =>{
  const list = await Listing.find({});
  res.render("list/index",{list});
})
//create new
.post(isLoggedIn,validateListing, wrapAsync(listingController.create));



//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);



//Edit route
router.get("/:id/edit",isLoggedIn,listingController.edit);



router.route("/:id")
//Update route
.put(isLoggedIn,isOwner,listingController.update)

//Delete route
.delete(isOwner,isLoggedIn,listingController.delete)

//show routes
.get(wrapAsync(listingController.renderShow)
);

module.exports = router;