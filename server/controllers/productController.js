const { Product, User, Category, Image, sequelize } = require("../models");
const { Op } = require("sequelize");

class productController {
  static async createProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.user;
      let { name, description, price, mainImg, categoryId, images } = req.body;

      const createproduct = await Product.create(
        {
          name: name,
          slug: "slug",
          description: description,
          price: price,
          mainImg: mainImg,
          categoryId: categoryId,
          authorId: id,
        },
        { transaction: t }
      );

      images = images.map((image) => {
        return {
          productId: createproduct.id,
          imgUrl: image,
        };
      });

      const bulkCreateImages = await Image.bulkCreate(images, {
        transaction: t,
      });

      await t.commit();

      res.status(201).json({
        statusCode: 201,
        message: `product ${name} created successfully`,
        data: createproduct,
        images: bulkCreateImages,
      });
    } catch (err) {
      await t.rollback();
      console.log(err);
      next(err);
    }
  }

  static async getProducts(req, res, next) {
    try {
      let products = await Product.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
          {
            model: Category,
          },
          { model: Image },
        ],
      });

      if (!products) {
        next({ name: "NotFound" });
      } else {
        res.status(200).json({
          statusCode: 200,
          data: products,
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getProduct(req, res, next) {
    try {
      console.log(req.params);
      const { id } = req.params;
      let product = await Product.findOne({
        where: { id: id },
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
          {
            model: Category,
          },
          { model: Image },
        ],
      });

      console.log(product);

      if (product === null) {
        next({ name: "NotFound" });
      } else {
        res.status(200).json({
          statusCode: 200,
          data: product,
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async editProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const authorId = req.user.id;
      let { name, description, price, mainImg, categoryId, images } = req.body;
      console.log("REQ BODY>>>>>>", req.body);
      const { id } = req.params;
      const findProduct = await Product.findByPk(id);
      const updatedProduct = await Product.update(
        {
          name: name,
          slug: name.split(" ").join("-"),
          description: description,
          price: price,
          mainImg: mainImg,
          categoryId: categoryId,
          authorId: authorId,
        },
        { where: { id: id }, transaction: t }
      );

      const deletedImage = await Image.destroy({
        where: { productId: id },
        truncate: false,
        cascade: true,
      });

      console.log("images>>>>>", images);

      images = images.map((imageUrl) => {
        return {
          productId: findProduct.id,
          imgUrl: imageUrl,
        };
      });

      const bulkCreateImages = await Image.bulkCreate(images, {
        transaction: t,
      });

      await t.commit();

      res.status(200).json({
        statusCode: 200,
        message: `Product ${findProduct.name} has been updated successfully`,
      });
    } catch (err) {
      await t.rollback();
      console.log(err);
      next(err);
    }
  }

  static async editProductCopy(req, res, next) {
    try {
      const authorId = req.user.id;
      const { name, slug, description, price, mainImg, categoryId } = req.body;
      const { id } = req.params;
      const updatedproduct = await Product.update(
        {
          name: name,
          slug: "slug",
          description: description,
          price: price,
          mainImg: mainImg,
          categoryId: categoryId,
          authorId: authorId,
        },
        { where: { id: id } }
      );

      if (updatedproduct <= 0) {
        next({ name: "NotFound" });
      } else {
        res.status(200).json({
          message: `Product ${id} success to update`,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async destroyProduct(req, res, next) {
    try {
      const { id } = req.params;
      console.log("id>>>>", id);

      const beforeDelete = await Product.findByPk(id);
      const deletedProduct = await Product.destroy({
        where: { id: id },
        truncate: false,
        cascade: true,
      });

      if (deletedProduct <= 0) {
        next({ name: "NotFound" });
      } else {
        res.status(200).json({
          statusCode: 200,
          message: `Product ${beforeDelete.name} has been deleted successfully`,
        });
      }
    } catch (err) {
      console.log("ERROR>>>", err);
      next(err);
    }
  }
}

module.exports = productController;
