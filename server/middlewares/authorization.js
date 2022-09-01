const { Product } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      next({ name: "NotFound" });
    } else {
      if (req.user.role === "User") {
        next({ name: "Forbidden" });
      } else if (req.user.role === "Admin") {
        next();
      } else {
        next({ name: "Forbidden" });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authorization;
