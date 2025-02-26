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


    const vertexResponse = await generativeModel.generateContent(prompt);


    const content = vertexResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("[ERROR] No valid content in Vertex AI response:", vertexResponse);
      throw new Error("No valid content found in Vertex AI response.");
    }


    const cleanedMessage = content.replace(/```json/g, "").replace(/```/g, "").trim();

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

    return routeData;
  } catch (error) {
    console.error("[ERROR] Error in Vertex AI service:", error);
    throw error;
  }
};

export default {
  generateRoute,
};
