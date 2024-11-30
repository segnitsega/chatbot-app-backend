const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization"); // Use "Authorization" header (standard practice)

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Handle "Bearer <token>" format

    // Ensure the decoded token has the expected structure (userId)
    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ msg: "Token is not valid (missing user information)" });
    }

    // Set req.user with the decoded user info
    req.user = decoded.user; // Attach the user object to req.user
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message || err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
