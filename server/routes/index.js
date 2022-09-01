const router = require("express").Router();
const { userController } = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const pubRoutes = require("./pub");
const productRoutes = require("./products");

router.post("/login", userController.login);

router.use(authentication);
router.post("/register", userController.register);
router.use("/products", productRoutes);

module.exports = router;
