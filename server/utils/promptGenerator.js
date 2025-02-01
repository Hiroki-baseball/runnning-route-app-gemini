// utils/promptGenerator.js
export const generatePrompt = (originStr, destinationStr, distance) => {
    return `
  Generate a running course that meets the following requirements:
  
  ### Instructions
  - The starting point is "${originStr}", and the destination is "${destinationStr}".
  - The total distance **must** be exactly **${distance} km**.
  - Before proceeding, **verify** that the total distance is correct using **Python**.
  - If the starting point and destination are **the same**, create a **looping course** that forms a circular route.
  - **Do not include duplicate paths**—once a path is used, it **must not be used again**.
  - The starting point should be listed first, and the destination should be listed last.
  - Ensure the total number of waypoints **does not exceed 25**, including start and destination.
  - Arrange waypoints to form a circular route as much as possible.
  
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
  Important Notes:
  Do not include any extra text before or after the JSON output.
  Ensure that the output is valid JSON.
    `.trim();
  };
  