// config/config.js
import dotenv from 'dotenv';

dotenv.config();

const config = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  location: 'us-central1',
  geminiModelId: 'gemini-2.0-flash-exp',
  // port: process.env.PORT || 3001,
  port: process.env.PORT || 8080,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};

export default config;
