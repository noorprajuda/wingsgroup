const { OAuth2Client } = require("google-auth-library");
const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class userController {
  static async register(req, res, next) {
    try {
      console.log("req body>>>>>>>", req.body);
      const { email, password, name, address, phoneNumber } = req.body;
      if (!email) {
        throw { name: "EmailRequired" };
      }
      if (!password) {
        next({ name: "PasswordRequired" });
      }
      const role = "Admin";
      const user = await User.create({
        email,
        password,
        role,
        name,
        address,
        phoneNumber,
      });
      console.log(user);
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        next({ name: "EmailRequired" });
      }

      if (!password) {
        next({ name: "PasswordRequired" });
      }

      const user = await User.findOne({ where: { email: email } });

      if (user === null) {
        console.log("user null");

        throw { name: "Unauthorized" };
      } else if (!user) {
        next({ name: "Unauthorized" });
      } else if (!comparePassword(password, user.password)) {
        next({ name: "Unauthorized" });
      } else {
        console.log(user.dataValues, "<<<<<<<<<<<user userController login");
        const access_token = signToken({
          id: user.id,
          email: user.email,
        });

        console.log(access_token, "<<<<<<<<<<<access_token");

        res.status(200).json({
          access_token,
          name: user.name,
          role: user.role,
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = { userController };
