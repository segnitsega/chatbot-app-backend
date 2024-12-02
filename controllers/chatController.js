
const axios = require('axios');
const Chat = require('../models/Chat'); // If you're storing chat messages

// Grok API Key
const GROK_API_KEY = process.env.GEMINI_API_KEY || 'your-grok-api-key'; // Use the actual key from .env or fallback to default

// Controller to handle the chat request and get AI response
exports.chatWithAI = async (req, res) => {
    try {
      const userMessage = req.body.message; // Get message from frontend
  
      if (!userMessage) {
        return res.status(400).json({ message: 'Message is required' });
      }
  
      // Send the message to the Grok API
      const response = await axios.post(
        'https://api.x.ai/v1', // Replace with the actual Grok API endpoint
        // https://api.x.ai/v1/chat/completions
        {
          prompt: userMessage, // Send the message as the prompt
          max_tokens: 150, // Adjust based on the API response limits
        },
        {
          headers: {
            'Authorization': `Bearer ${GROK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Check if the response contains the expected data
      if (response.data && response.data.text) {
        const aiResponse = response.data.text; // Adjust this based on the actual response format from Grok
  
        // Optionally, store the conversation in the database
        await Chat.create({
          message: userMessage,
          response: aiResponse,
        });
  
        // Send AI response back to the frontend
        res.json({ message: aiResponse });
      } else {
        throw new Error('Grok API response did not contain expected data');
      }
  
    } catch (error) {
      // Improved error logging
      if (error.response) {
        console.error('Error interacting with Grok API:', error.response.data);
      } else {
        console.error('Error interacting with Grok API:', error.message);
      }
  
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
