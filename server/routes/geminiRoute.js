// routes/geminiRoute.js
import express from 'express';
import vertexService from '../services/vertexService.js';
import { generatePrompt } from '../utils/promptGenerator.js';
import { parseCoordinates } from '../utils/coordinateParser.js';

const router = express.Router();

router.post('/gemini-generate-route', async (req, res) => {
  const { origin, destination, distance } = req.body;

  if (!origin || !destination || !distance) {
    console.error("[ERROR] Missing required parameters:", { origin, destination, distance });
    return res.status(400).json({
      error: "'origin', 'destination', and 'distance' are required.",
    });
  }

  const originCoords = parseCoordinates(origin);
  const destinationCoords = parseCoordinates(destination);

  if (!originCoords || !destinationCoords) {
    console.error("[ERROR] Invalid coordinates format:", { origin, destination });
    return res.status(400).json({
      error: "Invalid coordinates format. Expected format 'lat,lng'.",
    });
  }

  const originStr = `${originCoords.lat},${originCoords.lng}`;
  const destinationStr = `${destinationCoords.lat},${destinationCoords.lng}`;

  const prompt = generatePrompt(originStr, destinationStr, distance);


  try {
    const routeData = await vertexService.generateRoute(prompt);

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
