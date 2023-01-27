const path = require("path");
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story");

// @desc Login/Landing Page
// @route GET  /

router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: path.join(__dirname, "../views/layouts/login.hbs"),
  });
});

// @desc Dashboard
// @route GET /dashboard

router.get("/dashboard", ensureAuth, async (req, res) => {
  //   console.log("user data", req.user);
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (error) {
    console.log("error occured ", error.message);
    res.render("error/500");
  }
});

module.exports = router;
