if(process.env.NODE_ENV!=="production"){
require("dotenv").config();
}
const dns = require("node:dns");
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1"]);
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const layout=require("express-ejs-layouts");

const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listingSchema=require("./schema.js");
const reviewSchema=require("./schema.js").reviewSchema;
const Review=require("./Models/review.js");
const flash=require("connect-flash");
const session=require("express-session");
const { MongoStore } = require('connect-mongo');


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/boilerplate");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(layout);
app.use(express.static(path.join(__dirname,"/public")));
 
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");


const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js")

const dbUrl=process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));
 



const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*60*60
})
store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions={
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000, //----cookie expires after 7 days
    maxAge:7*24*60*60*1000, 
    httpOnly:true,
  },
  store:store 
}

app.use(session(sessionOptions));
//---------------------------
app.use(flash());
// here we are using flash to show a message when a new listing is added
//--------------------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//----------------------------------------


//----------------------
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user; //information of the current user belonging to a session
  next();
})
//-----------------------------------------


//-------------------validation (Server side)---------------------
const validateListing=(req,res,next)=>{
  let{error} =listingSchema.validate(req.body);


  if(error){
    let errMsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

const validateReview=(req,res,next)=>{
  let{error} =reviewSchema.validate(req.body);


  if(error){
    let errMsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}
//-----------------------------------------------------
//----------demo route for passport------------------
// app.get("/demoUser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   })
//   let registeredUser=await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
//   //the password is helloworld
// })
//-----------------------------------
app.use("/listings",listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter); 
app.use("/",userRouter);
//---------------handling errors--------------------
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong"}=err;
// res.status(statusCode).send(message);
res.status(statusCode).render("error.ejs",{message});
})
//------------------------------------------------------

app.listen(8010, () => {
  console.log("server is listening on port 8010");
});
