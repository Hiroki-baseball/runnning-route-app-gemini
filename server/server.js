import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { VertexAI } from "@google-cloud/vertexai";

// 環境変数の読み込み
const projectId = process.env.GOOGLE_PROJECT_ID;
const location = "us-central1";
const geminiModelId = "gemini-2.0-flash-exp"; 
const PORT = process.env.PORT || 3001;

// Expressアプリケーション設定
const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // フロントエンドのURLを指定
app.use(bodyParser.json());

// Vertex AIクライアントの初期化
const vertexAI = new VertexAI({
  project: projectId,
  location,
});

app.post("/api/gemini-generate-route", async (req, res) => {
  const { origin, destination, distance } = req.body;

  // リクエストボディのバリデーション
  if (!origin || !destination || !distance) {
    console.error("[ERROR] Missing required parameters:", { origin, destination, distance });
    return res.status(400).json({
      error: "'origin', 'destination', and 'distance' are required.",
    });
  }

  // 文字列 "35.681236,139.767125" を [35.681236, 139.767125] に変換
const originCoords = origin.split(",").map(Number);
const destinationCoords = destination.split(",").map(Number);

// { lat: xx, lng: yy } のオブジェクト形式にする
const originLatLng = { lat: originCoords[0], lng: originCoords[1] };
const destinationLatLng = { lat: destinationCoords[0], lng: destinationCoords[1] };

console.log("Parsed Origin:", originLatLng);
console.log("Parsed Destination:", destinationLatLng);

// 緯度・経度を文字列として埋め込む
const originStr = `${originLatLng.lat},${originLatLng.lng}`;
const destinationStr = `${destinationLatLng.lat},${destinationLatLng.lng}`;

  // プロンプトの作成
  const prompt = `
Generate a running course that meets the following requirements:

### Instructions
- The starting point is "${originStr}", and the destination is "${destinationStr}".
- The total distance **must** be exactly **${distance} km**.
- Before proceeding, **verify** that the total distance is correct using **Python**.
- If the starting point and destination are **the same**, create a **looping course** that forms a circular route.
- **Do not include duplicate paths**—once a path is used, it **must not be used again**.
- The starting point should be listed first, and the destination should be listed last.
- Ensure the total number of waypoints **does not exceed 25**, including start and destination
- Arrange waypoints to form a circular route as much as possible

### Output Format
Return a **valid JSON object** in the following structure:
json
{
  "waypoints": [
    {
      "name": "Location Name",
      "latitude": 35.0000,
      "longitude": 139.0000
    },
    ...
  ]
}
Important Notes
Do not include any extra text before or after the JSON output.
Ensure that the output is valid JSON.

`;

  try {
    // モデルの取得
    const generativeModel = vertexAI.getGenerativeModel({
      model: geminiModelId,
    });

    // プロンプトでコンテンツ生成
    console.log("[INFO] Sending request to Vertex AI with prompt:", prompt.trim());
    const vertexResponse = await generativeModel.generateContent(prompt);

    // レスポンス全体をログ
    console.log("[DEBUG] Full response from Vertex AI:", JSON.stringify(vertexResponse, null, 2));

    // API の戻り値からテキスト本体を取得
    const content = vertexResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("[ERROR] No valid content in Vertex AI response:", vertexResponse);
      return res.status(500).json({ error: "No valid content found in Vertex AI response." });
    }
    console.log("[INFO] Raw response content from Vertex AI:", content);

    // 出力を整形
    const cleanedMessage = content.replace(/```json/g, "").replace(/```/g, "").trim();


    if (!cleanedMessage) {
      console.error("[ERROR] Content is not a valid string:", content);
      return res.status(500).json({
        error: "Response content is not a valid string.",
      });
    }

    // JSON形式にパース
    let routeData;
    try {
      routeData = JSON.parse(cleanedMessage);
    } catch (jsonError) {
      console.error("[ERROR] Failed to parse JSON response:", cleanedMessage);
      throw new Error("Invalid JSON format returned by the model.");
    }
    console.log("[INFO] Generated route data:", routeData);

    // 必要なwaypointsの検証
    if (!routeData.waypoints || routeData.waypoints.length < 2) {
      console.error("[ERROR] Invalid route data (Not enough waypoints):", routeData);
      return res.status(400).json({
        error: "Invalid route data returned. Not enough waypoints.",
      });
    }

    // 結果をレスポンスとして送信
    console.log("[INFO] Generated route data:", routeData);
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

// サーバーの起動
app.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
  console.log(`[INFO] Google Cloud Project ID: ${projectId}`);
  console.log(`[INFO] Gemini Model ID: ${geminiModelId}`);
});
