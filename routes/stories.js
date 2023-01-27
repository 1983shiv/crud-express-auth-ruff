const path = require("path");
const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

// @desc  Show all Stories
// @route GET  /stories/index

router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    console.log("story user", stories);
    res.render("stories/index", { stories });
  } catch (error) {
    console.warn(error);
    res.render("error/500");
  }
});

// @desc Stories add page
// @route GET  /stories/add

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc  Process the add form
// @route GET  /stories/add
router.post("/add", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.warn(error);
    res.render("error/500");
  }
});

module.exports = router;
