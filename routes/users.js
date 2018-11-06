const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//load User model
const User = require("../models/User");
const secretKeys = require("../config/keys");

//create route for sign up
router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({ email: "user exist" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      //hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // Store hash in your password DB.
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//create route for login
router.post("/login", (req, res) => {
  //   const email = req.body.email;

  console.log(req.body.email);
  const password = req.body.password;

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    //check a password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        res.status(404).json({ password: "Password incorrect" });
      } else {
        // User Matched

        // Create JWT Payload
        const payload = { id: user.id, name: user.name };

        // Sign Token
        jwt.sign(
          payload,
          secretKeys.jwtSecreteKeys,
          { expiresIn: 60 * 60 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      }
    });
  });
});

//create secured route
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
