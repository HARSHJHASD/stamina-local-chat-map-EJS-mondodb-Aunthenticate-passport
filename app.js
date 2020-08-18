//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const saltRound = 10;
const bodyparser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const app = express();


app.set("view engine", "ejs");

app.use(express.static("public"));
// using body parser to fetch the code
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
// contacting Mongoose
mongoose.connect("mongodb://localhost:27017/staminaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

var array = [];
// creating schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// adding plugin to our user schema
userSchema.plugin(passportLocalMongoose);
// creating model from userschema
const User = mongoose.model("User", userSchema);
// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());
// here we are adding to our "model";"user"
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.post("/register", function(req, res) {
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/index");
      });
    }
  });
});


app.post("/login", function(req, res) {
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


app.get("/logout",function(req,res){
req.logout();
res.redirect("/login");
});


app.get("/index", function(req, res) {
  if(req.isAuthenticated()){
    res.render("index.ejs");
  }else{
    res.redirect("/login");
  }
});

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


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
