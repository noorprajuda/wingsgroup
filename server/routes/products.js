const productController = require("../controllers/productController");
const authorization = require("../middlewares/authorization");
const { Product, User, Category, Image } = require("../models");
const router = require("express").Router();

router.get("/", productController.getProducts);

router.post("/", productController.createProduct);

router.get("/:id", productController.getProduct);

router.put("/:id", authorization, productController.editProduct);

router.delete("/:id", authorization, productController.destroyProduct);

module.exports = router;
