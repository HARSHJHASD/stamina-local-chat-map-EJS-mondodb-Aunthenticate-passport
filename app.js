//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10;


const bodyparser = require("body-parser");
const ejs = require("ejs");
// contacting Mongoose
mongoose.connect("mongodb://localhost:27017/staminaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);
const _ = require("lodash")
const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
// using body parser to fetch the code
app.use(bodyparser.urlencoded({
  extended: true
}));

var array = [];
// creating schema
var userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// creating model
const User = mongoose.model("User", userSchema);




app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRound, function(error, hash) {
    const user = new User({
      email: req.body.username,
      password: hash
    });

    array.push(user);
    User.insertMany(array, function(error, result) {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/login");
      }
    });
  });

});


app.post("/login", function(req, res) {
      const password = req.body.password;
      User.findOne({
          email: req.body.username
        }, function(error, founduser) {
          if (error) {
            console.log(error);
          } else {
            if (founduser) {
              bcrypt.compare(password, founduser.password, function(error, result) {
                if (result===true) {
                  res.render("index.ejs");
                } else {
                  res.redirect("/login");
                }
              });
            } else {
              res.redirect("/register");
            }
          }
      });
    });

    app.get("/register", function(req, res) {
      res.render("register.ejs");
    }); app.get("/login", function(req, res) {
      res.render("login.ejs");
    }); app.get("/", function(req, res) {
      res.render("home.ejs");
    }); app.get("/about", function(req, res) {
      res.render("about.ejs");
    }); app.get("/blog", function(req, res) {
      res.render("blog.ejs");
    }); app.get("/contact", function(req, res) {
      res.render("contact.ejs");
    }); app.get("/gallery", function(req, res) {
      res.render("gallery.ejs");
    }); app.get("/pricing", function(req, res) {
      res.render("pricing.ejs");
    }); app.get("/weightgaining", function(req, res) {
      res.render("weightgaining.ejs");
    }); app.get("/weighttraining", function(req, res) {
      res.render("weighttraining.ejs");
    }); app.get("/weightloss", function(req, res) {
      res.render("weightloss.ejs");
    });


    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });
