const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(500).json({ succes: false, message: "Category not found" });
  }

  res.status(200).send(category);
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.icon,
    },
    {
      new: true,
    }
  );
  if (!category) {
    res.status(500).json({ succes: false, message: "Category not found" });
  }

  res.status(200).send(category);
});

router.post(`/`, async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) {
    res.send(500).send("Category is not created");
  }

  res.send(category);
});

router.delete("/:id", async (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (!category) {
        return res
          .status(500)
          .json({ success: false, message: "Category is not deleted" });
      }

      return res
        .status(200)
        .json({ succes: true, message: "Category is deleted" });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err: err });
    });
});

module.exports = router;
