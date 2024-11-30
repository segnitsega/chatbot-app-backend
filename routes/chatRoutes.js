const express = require("express");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// POST: Send message and get bot response
router.post("/send", authMiddleware, async (req, res) => {
  const { message } = req.body;

  // Ensure a message is provided
  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    // Example chatbot logic (replace with your own chatbot API or AI logic)
    const response = `Bot: You said, "${message}"`;

    // Save chat in the database (link to the authenticated user)
    const chat = new Chat({
      user: req.user.id,  // Store user ID from the authenticated token
      message,
      response,
    });
    await chat.save();  // Save the chat object to the database

    // Send the response back to the user
    res.json({ message: "Message sent successfully", response });
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET: Fetch chat history for the authenticated user
router.get("/history", authMiddleware, async (req, res) => {
  try {
    // Fetch the user's chat history, sorted by date (most recent first)
    const chats = await Chat.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Return the chat history
    res.json(chats);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
