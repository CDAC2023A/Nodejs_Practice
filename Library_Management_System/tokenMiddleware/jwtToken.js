const jwt = require("jsonwebtoken");
const secretKey = "12764secretkey";
const expiresIn = process.env.JWT_EXPIRY_TIME || "500s";

const { tokenData } = require("../controllers/usersController");

module.exports = {
  //generate token
  generateToken: async (req, resp, next) => {
    jwt.sign({ tokenData }, secretKey, { expiresIn }, (err, token) => {
      if (err) {
        console.error("Error generating token:", err);
        resp.status(500).json({ error: "Internal Server Error" });
      } else {
        resp.json({ token });
      }
      tokenValue = tokenData[0];
      console.log(tokenValue);
      module.exports.tokenValue=tokenValue;
    });
    next();
  },

  //Token verify
  verifyToken: (req, resp, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
      req.token = token;
      next();
      console.log('Working tokenput');
    } else {
      resp.send({
        result: "token is not valid",
      });
    }
  },
};
