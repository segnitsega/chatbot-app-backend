# Generative AI Chatbot App - Backend

This is the backend for the **Generative AI Chatbot App**, handling user authentication, chat functionality, and integration with GROK AI's API. The backend is built using **Node.js** and **Express.js** and uses **MongoDB** as the database.

## Features

- User authentication (Sign up and Login) with hashed passwords.
- MongoDB for storing user data securely.
- Integration with GROK AI's API to simulate AI responses.
- JWT-based authentication for secure API access.

## Tech Stack

- **Node.js** - Backend runtime.
- **Express.js** - Web framework for Node.js.
- **MongoDB** - NoSQL database for user data.
- **bcrypt.js** - For password hashing.
- **jsonwebtoken** - For generating and verifying JWT tokens.

## Setup Instructions

1. Clone the repository:
   ```bash
        git clone <backend-repo-url>
        cd <backend-repo-folder>
2. Install dependencies:

    ```bash
        npm install
3. Set up environment variables:
    - Create a .env file in the root directory.
    - Add the following keys
    ```bash
        MONGO_URI=<your-mongodb-connection-string>
        JWT_SECRET=<your-secret-key>
        PORT=5000
        GROK_AI_API_KEY=<your-grok-ai-api-key>
4. Start the server:
    ```bash
        node server.js

## API Endpoints
 # Authentication
    -POST /signup: Register a new user.
    -POST /login: Login a user and return a JWT token.
 # Chat
    POST /chat: Send user messages and get AI responses.

## Project Structure
 ```bash
        src/
        ├── models/          # Mongoose schemas
        ├── routes/          # API route handlers
        ├── controllers/     # Logic for API endpoints
        ├── middlewares/     # Authentication and validation middlewares
        └── server.js        # Entry point
## Project Frontend:

# https://github.com/segnitsega/chatbot-app.git
