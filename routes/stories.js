const path = require("path");
const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");
const { populate } = require("../models/Story");

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

// @desc Stories single page
// @route GET  /stories/{{id}}
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    } else {
      res.render("stories/single", {
        story,
      });
    }
  } catch (error) {
    console.warn(error);
    res.render("error/500");
  }
});

// @desc Stories add page
// @route GET  /stories/add
router.get("/add", ensureAuth, (req, res) => {
  try {
    res.render("stories/add");
  } catch (error) {
    console.warn(error);
    res.render("error/500");
  }
});

// @desc  Process the add form
// @route POST  /stories/add
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

// @desc  Stories edit page
// @route GET  /stories/edit

router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id }).lean();

  if (!story) {
    return res.render("error/404");
  }
  if (story.user != req.user.id) {
    return res.render("/stories");
  } else {
    res.render("stories/edit", {
      story,
    });
  }
});

// @desc    Process the edit form
// @route   PUT  /stories/edit/:id
router.put("/edit/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.warn(error);
    res.render("error/500");
  }
});

// @desc    Delete a story form
// @route   DELETE  /stories/delete/:id
router.delete("/delete/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.warn(error);
    res.render("error/500");
  }
});

module.exports = router;
