const User = require("../Models/user");

module.exports.renderSignupForm= (req, res) => {
  res.render("Users/signup.ejs");
}

module.exports.signup=async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password); 
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err) return next(err);
      req.flash("success", "Welcome To WanderLust");
      res.redirect("/listings");
    });
    
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}

module.exports.renderLoginForm=async(req,res)=>{
    res.render("Users/login.ejs");
}

module.exports.Login= async(req,res)=>{
//passport provides an authenticate() function,which is used as soute middleare to authenticate requests
// res.send("welcome to WanderLust! You have logged in")

  req.flash("success","Welcome back to WanderLust!");
  res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.Logout=(req,res,next)=>{
  req.logout((err)=>{
    if(err){
     return next(err);
    }

    req.flash("success","you are logged out!");
    return res.redirect("/listings");
  })
}