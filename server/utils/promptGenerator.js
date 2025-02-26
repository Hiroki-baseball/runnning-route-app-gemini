// utils/promptGenerator.js
export const generatePrompt = (originStr, destinationStr, distance) => {
    return `
Generate a running course with an exact distance of ${distance} km that meets these strict requirements:

### Instructions:
1. **Start & Destination:**  
   - The course starts at "${originStr}" (latitude,longitude) and ends at "${destinationStr}" (latitude,longitude).

2. **Exact Distance (STRICTLY ENFORCED):**  
   - The total running course **must be exactly ${distance} km**.  
   - **No approximations. No rounding.**  
   - The distance constraint **must be strictly followed**.

3. **Looping Course (if applicable):**  
   - If the start and destination are the same, design a **circular route**.  
   - Ensure smooth transitions without unnecessary detours.

4. **Unique Paths:**  
   - Each path segment **must be unique**—**no backtracking allowed**.

5. **Waypoint Constraints:**  
   - The **first waypoint** must be the start, and the **last waypoint** must be the destination.  


6. **Route Layout & Logical Flow:**  
   - Arrange waypoints **logically and smoothly** to create a **cohesive running course**.  
   - **Strictly adhere to the exact distance constraint**—do **not** exceed or fall short.  
   - Prioritize efficiency and smooth turns to maintain a good running flow.

🚨 **Reminder:**  
- The total running course **MUST** be **EXACTLY** ${distance} km.  
- **No approximations. No rounding.**  
- **Strict compliance is mandatory.**

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
  