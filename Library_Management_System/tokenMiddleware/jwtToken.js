const jwt = require("jsonwebtoken");
const secretKey = "12764secretkey";
const expiresIn = process.env.JWT_EXPIRY_TIME || "500s";
const tokenManager = require("../tokenMiddleware/tokenManager");

module.exports = {
  //generate token
  generateToken: async (req, resp, next) => {
    try {
      // Retrieve user data from the userDataModule
      const userData = tokenManager.getUserData();

      // Ensure there is user data available
      if (userData.length === 0) {
        resp.status(401).json({ error: "User data not available" });
        return;
      }

      jwt.sign({ userData }, secretKey, { expiresIn }, (err, token) => {
        if (err) {
          console.error("Error generating token:", err);
          resp.status(500).json({ error: "Internal Server Error" });
        } else {
          resp.json({ token });
        }
      });
    } catch (error) {
      console.error("Error during token generation:", error);
      resp.status(500).json({ error: "Internal Server Error" });
    }

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
      console.log("valid token");
    } else {
      resp.send({
        result: "token is not valid",
      });
    }
  },
   extractUserData: (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken.userData[0][0];
  },
};
