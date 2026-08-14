import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;

    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication required. Token missing." });
    }

    try {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = verifyToken.userId || verifyToken.id;
      next();
    } catch (jwtError) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
    }
  } catch (error) {
    console.error("isAuth middleware error:", error);
    return res.status(500).json({ message: `Authentication error: ${error.message}` });
  }
};

export default isAuth;