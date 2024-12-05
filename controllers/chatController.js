
const axios = require('axios');
const Chat = require('../models/Chat'); 

// Grok API Key
const GROK_API_KEY = process.env.GEMINI_API_KEY || 'your-grok-api-key'; 

// Controller to handle the chat request and get AI response
exports.chatWithAI = async (req, res) => {
    try {
      const userMessage = req.body.message; // Get message from frontend
  
      if (!userMessage) {
        return res.status(400).json({ message: 'Message is required' });
      }
  
      // Send the message to the Grok API
      const response = await axios.post(
        'https://api.x.ai/v1',
        {
          prompt: userMessage, 
          max_tokens: 150, 
        },
        {
          headers: {
            'Authorization': `Bearer ${GROK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.text) {
        const aiResponse = response.data.text; 

        await Chat.create({
          message: userMessage,
          response: aiResponse,
        });
  
        res.json({ message: aiResponse });
      } else {
        throw new Error('Grok API response did not contain expected data');
      }
  
    } catch (error) {
      
      if (error.response) {
        console.error('Error interacting with Grok API:', error.response.data);
      } else {
        console.error('Error interacting with Grok API:', error.message);
      }
  
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
