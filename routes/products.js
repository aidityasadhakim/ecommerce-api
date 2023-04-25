const express = require("express");
const routers = express();
const { Product } = require("../models/products");
const { Category } = require("../models/category");
const mongoose = require("mongoose");

routers.get(`/`, async (req, res) => {
  let filter = {};

  if (req.query.category) {
    filter = { category: req.query.category.split(",") };
  }

  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

// Select only by some values
// routers.get(`/`, async (req, res) => {
//   const productList = await Product.find().select("name image");

//   if (!productList) {
//     res.status(500).json({ success: false });
//   }

//   res.send(productList);
// });

routers.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }

  res.send(product);
});

routers.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category Not Found" });
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "The product cannot be created" });
  }

  res.status(200).send(product);
});

routers.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  const category = Category.findById(req.body.category);

  if (!category) {
    return res.send(500).json({ success: false, message: "Invalid Category" });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  ).populate("category");

  if (!product) {
    return res
      .status(400)
      .json({ success: false, message: "Data is not updated" });
  }

  res.send(product);
});

routers.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (!product) {
        return res
          .status(500)
          .json({ success: false, message: "Data Not Deleted" });
      }

      return res.status(200).json({ success: true, message: "Data deleted" });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

routers.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }

  res.send({
    productCount: productCount,
  });
});

routers.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }

  res.send(products);
});

module.exports = routers;
