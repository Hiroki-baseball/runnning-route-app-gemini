// client/src/pages/RoutePlanner.jsx
import React, { useState, useEffect,useRef } from "react";
import MapView from "../components/MapView";
import RouteForm from "../components/RouteForm";
import { reverseGeocode, geocodeAddress } from "../utils/geocoding";
import config from '../config';

const initialDistancePresets = [3, 5, 10, 21.1, 42.2];
const apiUrl = `${config.apiBaseUrl}/api/gemini-generate-route`;

function RoutePlanner() {
  const [origin, setOrigin] = useState("東京駅");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [destination, setDestination] = useState("秋葉原駅");
  const [distance, setDistance] = useState(5);
  const [routeData, setRouteData] = useState(null);
  const [directions, setDirections] = useState(null);
  const [directionsLoaded, setDirectionsLoaded] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const [distancePresets, setDistancePresets] = useState(initialDistancePresets);
  const [newPreset, setNewPreset] = useState("");
  const [customDistance, setCustomDistance] = useState("");
  const hasFetchedLocation = useRef(false);

    const clearStoredLocation = () => {
      sessionStorage.removeItem("currentLocation");
    };
  
    const getStoredLocation = () => {
      const storedLocation = sessionStorage.getItem("currentLocation");
      if (storedLocation) {
        const parsed = JSON.parse(storedLocation);
        setOrigin(parsed.address);
        return true;
      }
      return false;
    };
  
    const fetchCurrentLocation = () => {
      if (hasFetchedLocation.current) return;
      hasFetchedLocation.current = true;
  
      if (!navigator.geolocation) {
        alert("Geolocationはこのブラウザでサポートされていません。");
        setUseCurrentLocation(false);
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const address = await reverseGeocode(lat, lng);
            setOrigin(address);
            sessionStorage.setItem(
              "currentLocation",
              JSON.stringify({ lat, lng, address })
            );
          } catch (e) {
            console.error(e);
            const fallbackAddress = `${lat},${lng}`;
            setOrigin(fallbackAddress);
            sessionStorage.setItem(
              "currentLocation",
              JSON.stringify({ lat, lng, address: fallbackAddress })
            );
          }
        },
        (error) => {
          console.error("現在地を取得できませんでした: ", error);
          alert("現在地を取得できませんでした。位置情報が許可されているか確認してください。");
          setUseCurrentLocation(false);
        }
      );
    };
  
    useEffect(() => {
      if (!useCurrentLocation) {
        clearStoredLocation();
        return;
      }
  
      if (getStoredLocation()) {
        return;
      }
  
      fetchCurrentLocation();
    }, [useCurrentLocation]);

  const addPreset = () => {
    if (newPreset && !isNaN(parseFloat(newPreset))) {
      setDistancePresets([...distancePresets, parseFloat(newPreset)]);
      setNewPreset("");
    }
  };

  const removePreset = (preset) => {
    setDistancePresets(distancePresets.filter((d) => d !== preset));
  };

  const handleGenerateRoute = async () => {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      setDirectionsLoaded(false);
      setRouteData(null);
      setDirections(null);

      const finalDistance = customDistance ? parseFloat(customDistance) : distance;

      const originLatLng = await geocodeAddress(origin);
      const destinationLatLng = await geocodeAddress(destination);

      // APIコール(サーバーでルートを生成する想定)
      // デプロイ用
      // const response = await fetch("/api/gemini-generate-route", {
      // ローカル用
      // const response = await fetch("http://localhost:8080/api/gemini-generate-route", {
        const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: `${originLatLng.lat},${originLatLng.lng}`,
          destination: `${destinationLatLng.lat},${destinationLatLng.lng}`,
          distance: finalDistance,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRouteData(data); 
    } catch (error) {
      console.error(error);
      alert(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <MapView
        routeData={routeData}
        directions={directions}
        setDirections={setDirections}
        directionsLoaded={directionsLoaded}
        setDirectionsLoaded={setDirectionsLoaded}
        isRequesting={isRequesting}
      />

      <RouteForm
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        useCurrentLocation={useCurrentLocation}
        setUseCurrentLocation={setUseCurrentLocation}
        distance={distance}
        setDistance={setDistance}
        distancePresets={distancePresets}
        newPreset={newPreset}
        setNewPreset={setNewPreset}
        addPreset={addPreset}
        removePreset={removePreset}
        customDistance={customDistance}
        setCustomDistance={setCustomDistance}
        handleGenerateRoute={handleGenerateRoute}
        isRequesting={isRequesting}
      />
    </main>
  );
}

export default RoutePlanner;
