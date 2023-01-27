const path = require("path");
const express = require("express");
const router = express.Router();

// @desc Login/Landing Page
// @route GET  /

router.get("/", (req, res) => {
  res.render("login", {
    layout: path.join(__dirname, "../views/layouts/login.hbs"),
  });
});

// @desc Dashboard
// @route GET /dashboard

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
