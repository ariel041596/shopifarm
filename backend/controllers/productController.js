import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Fetch All Products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        // Only name of the product can search
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductByID = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access PRIVATE/ADMIN
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    // you can also call if the certain user who create the product can
    // delete the product
    // by checking
    // if(req.user._id == product.user._id)
    await product.remove();
    res.json({
      message: "Successfully deleted product",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create product
// @route POST /api/products
// @access PRIVATE/ADMIN
const createProduct = asyncHandler(async (req, res) => {
  // const {
  //   orderItems,
  //   shippingAddress,
  //   paymentMethod,
  //   itemsPrice,
  //   taxPrice,
  //   shippingPrice,
  //   totalPrice,
  // } = req.body;
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc Update Product
// @route PUT /api/propducts/:id/edit
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
  } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create new review on product
// @route POST /api/propducts/:id/review
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review Added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc GET TOP RATED products
// @route GET /api/products/top
// @access Public
const getTopRatedProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  if (products.length) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No top products");
  }
});

export {
  getProducts,
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopRatedProduct,
};
