// routes/geminiRoute.js
import express from 'express';
import vertexService from '../services/vertexService.js';
import { generatePrompt } from '../utils/promptGenerator.js';
import { parseCoordinates } from '../utils/coordinateParser.js';

const router = express.Router();

router.post('/gemini-generate-route', async (req, res) => {
  const { origin, destination, distance } = req.body;

  // リクエストボディのバリデーション
  if (!origin || !destination || !distance) {
    console.error("[ERROR] Missing required parameters:", { origin, destination, distance });
    return res.status(400).json({
      error: "'origin', 'destination', and 'distance' are required.",
    });
  }

  // 座標文字列をパース（例："35.681236,139.767125" → { lat, lng }）
  const originCoords = parseCoordinates(origin);
  const destinationCoords = parseCoordinates(destination);

  if (!originCoords || !destinationCoords) {
    console.error("[ERROR] Invalid coordinates format:", { origin, destination });
    return res.status(400).json({
      error: "Invalid coordinates format. Expected format 'lat,lng'.",
    });
  }

  // プロンプト作成のため、座標を文字列に整形
  const originStr = `${originCoords.lat},${originCoords.lng}`;
  const destinationStr = `${destinationCoords.lat},${destinationCoords.lng}`;

  const prompt = generatePrompt(originStr, destinationStr, distance);

  console.log("[DEBUG] OriginStr:", originStr);
  console.log("[DEBUG] DestinationStr:", destinationStr);
  console.log("[DEBUG] Distance:", distance);
  console.log("[DEBUG] Generated prompt:", prompt);

  try {
    const routeData = await vertexService.generateRoute(prompt);
    console.log("[DEBUG] routeData from Vertex AI:", JSON.stringify(routeData, null, 2));

    // 生成されたルートデータの検証（waypoints が存在し、最低2つの地点が必要）
    if (!routeData.waypoints || routeData.waypoints.length < 2) {
      console.error("[ERROR] Invalid route data (Not enough waypoints):", routeData);
      return res.status(400).json({
        error: "Invalid route data returned. Not enough waypoints.",
      });
    }

    res.json(routeData);
  } catch (error) {
    console.error("[ERROR] Gemini route generation failed:", {
      message: error.message,
      stack: error.stack,
      details: error.details || null,
    });
    res.status(500).json({
      error: "Error generating route",
      detail: error.message,
    });
  }
});

export default router;
