// app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from './config/config.js';
import geminiRoute from './routes/geminiRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// フロントエンドのURLは環境変数から取得
app.use(cors({ origin: config.frontendUrl }));
app.use(bodyParser.json());

// ルートの登録
app.use('/api', geminiRoute);

if (process.env.NODE_ENV === 'production') {

    const buildPath = path.join(__dirname, 'client-build');
  
    app.use(express.static(buildPath));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }

export default app;
