// client/src/pages/RoutePlanner.jsx
import React, { useState, useEffect,useRef } from "react";
import MapView from "../components/MapView";
import RouteForm from "../components/RouteForm";
import { reverseGeocode, geocodeAddress } from "../utils/geocoding";

const initialDistancePresets = [3, 5, 10, 21.1, 42.2];

function RoutePlanner() {
  // ---- State管理 ----
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

    // ✅ 1. `useCurrentLocation === false` のとき `sessionStorage` を削除
    const clearStoredLocation = () => {
      sessionStorage.removeItem("currentLocation");
    };
  
    // ✅ 2. `sessionStorage` に保存された現在地情報を取得（あれば `setOrigin`）
    const getStoredLocation = () => {
      const storedLocation = sessionStorage.getItem("currentLocation");
      if (storedLocation) {
        const parsed = JSON.parse(storedLocation);
        setOrigin(parsed.address);
        return true; // 既に保存されていた場合は true を返す
      }
      return false;
    };
  
    // ✅ 3. 現在地を取得し、API を発火して `sessionStorage` に保存
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
  
    // ✅ useEffect で関数を呼び出す
    useEffect(() => {
      if (!useCurrentLocation) {
        clearStoredLocation();
        return;
      }
  
      if (getStoredLocation()) {
        return; // 既に保存されていれば `fetchCurrentLocation` を呼ばない
      }
  
      fetchCurrentLocation();
    }, [useCurrentLocation]);

  // 距離プリセットの追加
  const addPreset = () => {
    if (newPreset && !isNaN(parseFloat(newPreset))) {
      setDistancePresets([...distancePresets, parseFloat(newPreset)]);
      setNewPreset("");
    }
  };

  // 距離プリセットの削除
  const removePreset = (preset) => {
    setDistancePresets(distancePresets.filter((d) => d !== preset));
  };

  // コース生成リクエスト
  const handleGenerateRoute = async () => {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      console.log("[DEBUG] Sending data:", { origin, destination, distance });
      setDirectionsLoaded(false);
      setRouteData(null);
      setDirections(null);

      // UIでcustomDistanceが入力されている場合はそれを優先
      const finalDistance = customDistance ? parseFloat(customDistance) : distance;

      // 出発地点・目的地のアドレスを緯度経度に変換
      const originLatLng = await geocodeAddress(origin);
      const destinationLatLng = await geocodeAddress(destination);

      // APIコール(サーバーでルートを生成する想定)
      const response = await fetch("http://localhost:3001/api/gemini-generate-route", {
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
      setRouteData(data); // { waypoints: [...] }
    } catch (error) {
      console.error(error);
      alert(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      {/* 地図描画 */}
      <MapView
        routeData={routeData}
        directions={directions}
        setDirections={setDirections}
        directionsLoaded={directionsLoaded}
        setDirectionsLoaded={setDirectionsLoaded}
        isRequesting={isRequesting}
      />

      {/* 入力フォーム (距離プリセット、出発地、目的地など) */}
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
