// config/config.js
import dotenv from 'dotenv';

dotenv.config();
// const isProduction = process.env.NODE_ENV === 'production';

const config = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  location: 'us-central1',
  geminiModelId: 'gemini-2.0-flash-exp',
  port: process.env.PORT || 8080,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8080",
  // apiBaseUrl: isProduction
  // ? "https://running-route-app-gemini-164279780988.asia-northeast1.run.app"  // Cloud Run 用
  // : "http://localhost:8080",  // ローカル開発用
  
};

export default config;
