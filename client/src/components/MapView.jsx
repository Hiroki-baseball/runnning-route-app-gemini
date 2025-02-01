// client/src/components/MapView.jsx
import React, { useMemo } from "react";
import { LoadScript, GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

// GoogleMapコンテナスタイル
const containerStyle = {
  width: "100%",
  height: "500px",
};

// 地図のデフォルト中心 (東京駅付近)
const defaultCenter = { lat: 35.681236, lng: 139.767125 };

function MapView({
  routeData,
  directions,
  setDirections,
  directionsLoaded,
  setDirectionsLoaded,
  isRequesting,
}) {
  // DirectionsService に渡すコールバック
  const handleDirectionsCallback = (res) => {
    if (!res || directionsLoaded) return;

    switch (res.status) {
      case "OK":
        setDirections(res);
        setDirectionsLoaded(true);
        break;
      case "OVER_QUERY_LIMIT":
        console.error("API quota exceeded.");
        break;
      default:
        console.error("Directions request failed:", res);
        break;
    }
  };

  // waypoint データを変換
  const { startLocation, endLocation, waypoints, googleMapsShareUrl } = useMemo(() => {
    if (!routeData || !routeData.waypoints || routeData.waypoints.length < 2) {
      return {
        startLocation: defaultCenter,
        endLocation: defaultCenter,
        waypoints: [],
        googleMapsShareUrl: "",
      };
    }

    const fullWaypoints = routeData.waypoints;
    const startLoc = { lat: fullWaypoints[0].latitude, lng: fullWaypoints[0].longitude };
    const endLoc = {
      lat: fullWaypoints[fullWaypoints.length - 1].latitude,
      lng: fullWaypoints[fullWaypoints.length - 1].longitude,
    };
    const middleWaypoints = fullWaypoints.slice(1, -1).map((wp) => ({
      location: { lat: wp.latitude, lng: wp.longitude },
      stopover: true,
    }));

    // Googleマップ共有URL
    const waypointStrings = fullWaypoints.slice(1, -1)
      .map((wp) => `${wp.latitude},${wp.longitude}`);
    const shareUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLoc.lat},${startLoc.lng}&destination=${endLoc.lat},${endLoc.lng}&waypoints=${waypointStrings.join("|")}`;

    return {
      startLocation: startLoc,
      endLocation: endLoc,
      waypoints: middleWaypoints,
      googleMapsShareUrl: shareUrl,
    };
  }, [routeData]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
      {/* ルートが生成できたときのみGoogleマップを開くボタンを表示 */}
      {googleMapsShareUrl && (
        <div className="absolute top-2 left-2 z-10">
          <a
            href={googleMapsShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Googleマップでルートを表示
          </a>
        </div>
      )}

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={13}>
          {/* ルートデータがあり、まだDirectionsがロードされていない・リクエスト中でない場合のみDirectionsServiceを呼び出す */}
          {routeData && routeData.waypoints && !directionsLoaded && !isRequesting && (
            <DirectionsService
              options={{
                origin: startLocation,
                destination: endLocation,
                waypoints: waypoints,
                travelMode: "WALKING",
              }}
              callback={handleDirectionsCallback}
            />
          )}
          {/* DirectionsRenderer は実際にルートを表示 */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapView;
