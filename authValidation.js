const jwt = require("jsonwebtoken");
const { RegisterModel } = require("./src/model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.givenToken;

    if (!token) {
      return res.status(401).send("Access denied: Unauthorized user");
    }

    const accessKey = process.env.access_key;

    const decoded = jwt.verify(token, accessKey);

    console.log("decoded:", decoded);

    const userData = await RegisterModel.findById(decoded.id);

    if (!userData) {
      return res.status(404).send("User not found");
    }

    req.user = userData;

    next();

  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid or expired token");
  }
};

module.exports = authMiddleware;