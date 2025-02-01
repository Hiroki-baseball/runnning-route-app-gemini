// app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import config from './config/config.js';
import geminiRoute from './routes/geminiRoute.js';

const app = express();

// フロントエンドのURLは環境変数から取得
app.use(cors({ origin: config.frontendUrl }));
app.use(bodyParser.json());

// ルートの登録
app.use('/api', geminiRoute);

export default app;
