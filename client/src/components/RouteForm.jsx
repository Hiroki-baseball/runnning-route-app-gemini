import React from "react";
import { MapPin, Navigation } from "lucide-react";
import DistancePresets from "./DistancePresets";

function RouteForm({
  origin,
  setOrigin,
  destination,
  setDestination,
  useCurrentLocation,
  setUseCurrentLocation,
  distance,
  setDistance,
  distancePresets,
  newPreset,
  setNewPreset,
  addPreset,
  removePreset,
  customDistance,
  setCustomDistance,
  handleGenerateRoute,
  isRequesting,
}) {
  return (
    <div className="mt-8 bg-grey border-2 border-blue-900 rounded-lg shadow-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* スタート地点 */}
        <div>
          <label
            htmlFor="start-point"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            出発地点
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              id="start-point"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="出発地点を入力"
            />
            {/* 現在地を使用 チェックボックス */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="use-current-location"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
                className="w-5 h-5 text-sky-500 bg-white border-gray-300 rounded focus:ring-sky-500"
              />
              <label htmlFor="use-current-location" className="text-sm text-gray-700">
                現在地を使用
              </label>
            </div>
          </div>
        </div>

        {/* ゴール地点 */}
        <div>
          <label
            htmlFor="end-point"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            目的地
          </label>
          <div className="relative">
            <Navigation
              className="absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              id="end-point"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="目的地を入力"
            />
            {/* 出発地点と同じにする チェックボックス */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="same-as-start"
                checked={destination === origin}
                onChange={() => setDestination(origin)}
                className="w-5 h-5 text-sky-500 bg-white border-gray-300 rounded focus:ring-sky-500"
              />
              <label htmlFor="same-as-start" className="text-sm text-gray-700">
                出発地点と同じにする
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 距離プリセット & カスタム距離 */}
      <DistancePresets
        distance={distance}
        setDistance={setDistance}
        distancePresets={distancePresets}
        newPreset={newPreset}
        setNewPreset={setNewPreset}
        addPreset={addPreset}
        removePreset={removePreset}
        customDistance={customDistance}
        setCustomDistance={setCustomDistance}
      />

      {/* コース生成ボタン */}
      <button
        onClick={handleGenerateRoute}
        className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
        disabled={isRequesting}
      >
        {isRequesting ? "処理中..." : "コース自動生成"}
      </button>
    </div>
  );
}

export default RouteForm;
