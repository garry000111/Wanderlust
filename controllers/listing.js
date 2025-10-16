const Listing = require("../models/listing");

module.exports.renderNewForm = (req,res)=>{
  res.render("list/new");
};

module.exports.renderShow = async (req,res)=>{
  let {id} = req.params;
  const specific = await Listing.findById(id).populate("reviews").populate("owner");
  if(!specific) {
    req.flash("error", "Listing you requested for does not exist! ");
    return res.redirect("/listing");
  }
  return res.render("list/show",{specific});

}

module.exports.create = async (req,res,next)=>{
  //console.log(req.body);
  
  const newList = new Listing(req.body.listing);
  newList.owner = req.user._id; 
  await newList.save();
  //console.log("Listing saved!");
  req.flash("success", "New listing created!");
  res.redirect("/listing");
}

module.exports.edit = async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist! ");
    return res.redirect("/listing");
  }
  res.render("list/edit",{listing});
}

module.exports.update = async (req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(currUser._id)){
    req.flash("error","You dont have access to update");
    return res.redirect(`/listing/${id}`);
  }
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listing/${id}`);
}

module.exports.delete = async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
}