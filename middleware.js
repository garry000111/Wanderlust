const Listing = require("./models/listing");
const { listingSchema , reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");




//schema validation function for listing
const validateListing = (req,res,next) =>{
  let { error } = listingSchema.validate(req.body);
  if(error){
    const errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};

const isLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
    return res.redirect("/login");
}
next();
};


const saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }else {
    res.locals.redirectUrl = '/listing'; // default redirect
  }
  next();
};

const isOwner = async (req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
};


//schema validation function for review
const validateReview = (req,res,next) =>{
  let { error } = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};


module.exports = {
  validateListing,
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  validateReview
};