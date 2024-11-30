// routes/chat.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Sample route for chat (can be extended later)
router.post("/message", authMiddleware, (req, res) => {
  const { message } = req.body;
  
  // Example response (you can replace this with actual AI logic)
  const response = {
    message: `AI Response to: ${message}`,
  };

  res.json(response);
});

module.exports = router;
