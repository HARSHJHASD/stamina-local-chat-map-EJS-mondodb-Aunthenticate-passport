//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", function(req, res) {
res.render("index.ejs") ;
});
app.get("/home", function(req, res) {
res.render("index.ejs") ;
});
app.get("/about", function(req, res) {
res.render("about.ejs");
});
app.get("/blog", function(req, res) {
res.render("blog.ejs") ;
});
app.get("/contact", function(req, res) {
res.render("contact.ejs") ;
});
app.get("/gallery", function(req, res) {
res.render("gallery.ejs") ;
});
app.get("/pricing", function(req, res) {
res.render("pricing.ejs") ;
});
app.get("/weightgaining", function(req, res) {
res.render("weightgaining.ejs") ;
});
app.get("/weighttraining", function(req, res) {
res.render("weighttraining.ejs") ;
});
app.get("/weightloss", function(req, res) {
res.render("weightloss.ejs") ;
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
