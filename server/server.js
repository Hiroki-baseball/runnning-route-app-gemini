// server.js
import app from './app.js';
import config from './config/config.js';

// const { port, projectId, geminiModelId } = config;
const port = process.env.PORT || config.port || 8080;

app.listen(port, () => {
  console.log(`[INFO] Server is running on port ${port}`);
});
