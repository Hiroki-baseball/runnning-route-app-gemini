// utils/coordinateParser.js
export const parseCoordinates = (coordinateStr) => {
    const coords = coordinateStr.split(',').map(Number);
    if (coords.length !== 2 || coords.some(isNaN)) {
      console.error("[ERROR] Invalid coordinate format:", coordinateStr);
      return null;
    }
    return {
      lat: coords[0],
      lng: coords[1],
    };
  };
  