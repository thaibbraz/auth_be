require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "my weak (!!) secret key";

module.exports = {
  SECRET_KEY,
};
