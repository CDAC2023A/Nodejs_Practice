const jwt = require("jsonwebtoken");
const secretKey = "12764secretkey";
require('dotenv').config();
const expiresIn = process.env.JWT_EXPIRY_TIME || "3600";

//const tokenManager = require("../tokenMiddleware/tokenManager");

module.exports = {
  //generate token
  generateToken: async (req, resp, next) => {
    try {
      const userData = req.userData;
      // Ensure there is user data available
      if (userData.length === 0) {
        resp.status(401).json({ error: "User data not available" });
        return userData ;
      }
      jwt.sign({ userData}, secretKey, { expiresIn }, (err, token) => {
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
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const decodedToken = jwt.verify(token, secretKey);
        console.log('Decoded Token:', decodedToken);
        if (!decodedToken || !decodedToken.userData) {
            throw new Error('Invalid or missing userData in the token');
        }

        return decodedToken.userData;
    } catch (error) {
        // Log details of the error during token verification
        console.error('Error during token verification:', error);
        return null;
    }
},
};
