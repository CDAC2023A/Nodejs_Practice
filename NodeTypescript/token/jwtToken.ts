import express from "express";
const app = express();
import jwt from "jsonwebtoken";
const expiresIn = process.env.JWT_EXPIRY_TIME || "3600";
const secretKey = "1276564secretkey";

const generateToken = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const userData = req.body;

    // Ensure there is user data available
    if (!userData) {
      resp.status(401).json({ error: "User data not available" });
      return;
    }

    // Your secret key and expiresIn variables

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
};

const verifyToken = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    // Extract token from request headers, query parameters, or cookies
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token ||
      (req.cookies && req.cookies.token); 

    // Check if token is available
    if (!token) {
      resp.status(401).json({ error: "Token not provided" });
      return;
    }

    // // Your secret key variable
    // const secretKey = "1276564secretkey";

    // Verify the token
    jwt.verify(token, secretKey, (err: any, decodedToken: any) => {
      if (err) {
        console.error("Error verifying token:", err);
        resp.status(401).json({ error: "Invalid token" });
      } else {
        req.body.decoded = decodedToken;
        console.log(decodedToken);
        
        next();
      }
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

export default { generateToken, verifyToken };
