// services/vertexService.js
import { VertexAI } from '@google-cloud/vertexai';
import config from '../config/config.js';

const vertexAI = new VertexAI({
  project: config.projectId,
  location: config.location,
});

const generateRoute = async (prompt) => {
  try {
    const generativeModel = vertexAI.getGenerativeModel({
      model: config.geminiModelId,
    });

    console.log("[INFO] Sending request to Vertex AI with prompt:", prompt.trim());

    const vertexResponse = await generativeModel.generateContent(prompt);

    console.log("[DEBUG] Full response from Vertex AI:", JSON.stringify(vertexResponse, null, 2));

    // Vertex AI のレスポンスからテキスト部分を取得
    const content = vertexResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("[ERROR] No valid content in Vertex AI response:", vertexResponse);
      throw new Error("No valid content found in Vertex AI response.");
    }

    console.log("[INFO] Raw response content from Vertex AI:", content);

    const cleanedMessage = content.replace(/```json/g, "").replace(/```/g, "").trim();
    console.log("[DEBUG] cleanedMessage:", cleanedMessage);

    if (!cleanedMessage) {
      console.error("[ERROR] Content is not a valid string:", content);
      throw new Error("Response content is not a valid string.");
    }

    let routeData;
    try {
      routeData = JSON.parse(cleanedMessage);
    } catch (jsonError) {
      console.error("[ERROR] Failed to parse JSON response:", cleanedMessage);
      console.error("[ERROR] JSON parse error stack:", jsonError);
      throw new Error("Invalid JSON format returned by the model.");
    }
    console.log("[DEBUG] Parsed routeData:", JSON.stringify(routeData, null, 2));

    return routeData;
  } catch (error) {
    console.error("[ERROR] Error in Vertex AI service:", error);
    throw error;
  }
};

export default {
  generateRoute,
};
