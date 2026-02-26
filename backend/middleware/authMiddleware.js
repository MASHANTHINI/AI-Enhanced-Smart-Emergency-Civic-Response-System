const jwt = require("jsonwebtoken");

const protect = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;

      next();
    } catch (error) {
      console.error("❌ JWT Error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = protect;