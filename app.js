//(npm i dotenv) this is for security  purpose ,as we have added a .env file and inside that we have stored our apis and secret files so for that
require("dotenv").config();
//jshint esversion:6
//requring express(npm module) to setup our server
const express = require("express");
//mongoose is a module in npm using whihc we can connect our website to mongodb data vase easily..(we have other ay MONGODB NATIVE DRIVER TOO)
const mongoose = require("mongoose");
const session = require("express-session");
//npm package that will be used for encryption ,authentication.
const passport = require("passport");
//requiring passport local mongooose(for authentification)
const passportLocalMongoose = require("passport-local-mongoose");
//used for salting.
const saltRound = 10;
//BODY parser is used so that we can use the form data in our app.js r in nodejs part
const bodyparser = require("body-parser");
//we have required ejs after npm i  ejs
const ejs = require("ejs");
//this is for setting routing parameters without any issue of capital letters and small letters
const _ = require("lodash")
//after requring express,we will create and app of express that will be used .
const app = express();
//here we are setting view engine as ejs, this is what we did after npm ejs module from npm ..this is compulsory if u r suing ejs
app.set("view engine", "ejs");
//al static files inside ou public folder
app.use(express.static("public"));
//in order to give static files (images and css) in node js we will  use static folder named "public"
// using body parser to fetch the code
app.use(bodyparser.urlencoded({
  extended: true
}));

//to setup session through cookies etc
app.use(session({
  //to access env variable stored  inside our .env "process.env.SECRET"
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
//using passport and session with express.
app.use(passport.session());
// contacting Mongoose(this is how we connect to our database using mongooose)
// mongoose.connect("mongodb://localhost:27017/staminaDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

//we are adding mongodb database using mongoose
mongoose.connect("mongodb+srv://admin-harsh:Test123@cluster0.whpfi.mongodb.net/staminaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//mandatory thing with mongoose
mongoose.set("useCreateIndex", true);

//we have created an empty array
var array = [];
// creating schema for user logins
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// adding plugin to our user schema
userSchema.plugin(passportLocalMongoose);
// creating model from userschema (1)User is a model we have created)..
const User = mongoose.model("User", userSchema);
// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());
// here we are adding passport to our "model";"user"
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to receieve data from /register page using body parser
app.post("/register", function(req, res) {
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      //error here cud be "user already in databasee" and that ud be printed on console .log
      console.log(err);
      //if error(old user) then again redirect to signup page
      res.redirect("/register");
    } else {
      //if user is isAuthenticated then proceed him/her to /index.
      passport.authenticate("local")(req, res, function(){
        res.redirect("/index");
      });
    }
  });
});

//what we are going to do with data we will receice from form that we have in our /login page.
app.post("/login", function(req, res) {
  //created a document from the user model we created earilier
  const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/index");
        });
      }
    });
});

//when lougout request will be reieved from the browser ,how will that be handled.
app.get("/logout",function(req,res){
req.logout();
res.redirect("/login");
});

//if anyone tried to get to /index directly ,it wil be checked if he/she is
app.get("/index", function(req, res) {
  if(req.isAuthenticated()){
    res.render("index.ejs");
  }else{
    res.redirect("/login");
  }
});


//based on different routes we will be rendering to different ejs pages.
app.get("/register", function(req, res) {
  res.render("register.ejs");
});
app.get("/login", function(req, res) {
  res.render("login.ejs");
});
app.get("/", function(req, res) {
  res.render("home.ejs");
});
app.get("/about", function(req, res) {
  res.render("about.ejs");
});
app.get("/blog", function(req, res) {
  res.render("blog.ejs");
});
app.get("/contact", function(req, res) {
  res.render("contact.ejs");
});
app.get("/gallery", function(req, res) {
  res.render("gallery.ejs");
});
app.get("/pricing", function(req, res) {
  res.render("pricing.ejs");
});
app.get("/weightgaining", function(req, res) {
  res.render("weightgaining.ejs");
});
app.get("/weighttraining", function(req, res) {
  res.render("weighttraining.ejs");
});
app.get("/weightloss", function(req, res) {
  res.render("weightloss.ejs");
});




//using express we are making and setting server in our local machine at port 3000
app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
