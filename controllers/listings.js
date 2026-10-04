const Listing = require("../Models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index=async (req, res,next) => {
 const searchQuery=String(req.query.q ?? "").trim();
 const filter={};
 if(searchQuery){
  const escapedQuery=searchQuery.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  filter.$or=["title","description","location","country"].map((field)=>({
   [field]:{$regex:escapedQuery,$options:"i"}
  }));
 }
 const alllistings = await Listing.find(filter);
  res.render("listings/index", { alllistings, searchQuery });
 
}

module.exports.rendernewForm=async (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
          path:"author"
        },
      })
      .populate("owner");
   if(!listing){
    req.flash("error","your request does not exist");
    return res.redirect("/listings");
   }
   if(!listing.geometry?.coordinates?.length){
    const response=await geocodingClient.forwardGeocode({
      query:`${listing.location}, ${listing.country}`,
      limit:1
    }).send();
    const feature=response.body.features[0];
    if(feature?.geometry){
      listing.geometry=feature.geometry;
      await listing.save();
    }
   }
   console.log(listing);
    res.render("listings/show",{listing});
}

module.exports.createListing=async (req,res,next)=>{

let response =await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 2
})
  .send();


let url=req.file.path;
let filename=req.file.filename;
// console.log(url+" "+filename);

const newListing = new Listing(req.body.listing);
newListing.geometry = response.body.features[0].geometry;

req.flash("success","new listing created");
console.log(req.user);
newListing.owner=req.user._id;

let savedListing=await newListing.save();
console.log(savedListing);
res.redirect("/listings");
}

module.exports.renderEditForm= async (req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","your request does not exist");
      return res.redirect("/listings");
    }

  let originalImageURL=listing.image || "";
  originalImageURL=originalImageURL.replace("/upload","/upload/h_300,w_250");
   res.render("listings/edit.ejs",{listing,originalImageURL})
}

module.exports.updateListing=async (req,res)=>{
      let{id}=req.params;

        let listing=await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });

        if(typeof req.file !== "undefined"){
      listing.image=req.file.path;
await listing.save();

}
       

        req.flash("success","listing updated");
        res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
      let {id}=req.params;
      let deletedListing= await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
       if(!deletedListing){
    req.flash("error","your request does not exist");
    return res.redirect("/listings");
   }
      req.flash("success","listing deleted");
      res.redirect("/listings");
}