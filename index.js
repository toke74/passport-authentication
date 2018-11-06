const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

//import local files
const users = require("./routes/users");
const keys = require("./config/keys");
//run passport js file
require("./config/passport");

//create app
const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set view engine
app.set("view engine", "ejs");

//create mongodb connection
mongoose.connect(
  keys.mongodb,
  () => {
    console.log("Mongodb connected");
  }
);

//initialize passport
app.use(passport.initialize());

//create home route
app.get("/", (req, res) => {
  res.render("home");
});

//create users route
app.use("/api/users", users);

//create port
const port = process.env.PORT || 5000;

//listen for port
app.listen(port, () => {
  console.log(`you are listening port number ${port}`);
});
