const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization"); // Use "Authorization" header (standard practice)
  console.log("Token received:", token)

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }


try {
  const tokenPart = token.split(" ")[1];
  if (!tokenPart) throw new Error("Malformed token");
  const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);
  req.user = decoded.user;
  next();
} catch (err) {
  console.error(err.message || err);
  res.status(401).json({ msg: "Invalid token" });
}
}

module.exports = authMiddleware;
