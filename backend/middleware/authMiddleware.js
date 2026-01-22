const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

const protect = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      console.log("🔐 AUTH HEADER:", authHeader);

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // 🔓 VERIFY TOKEN USING SAME SECRET
      const decoded = jwt.verify(token, JWT_SECRET);

      console.log("✅ DECODED TOKEN:", decoded);

      // 🔐 ROLE CHECK
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      };

      next();
    } catch (error) {
      console.error("❌ JWT Error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = protect;
