// client/src/components/DistancePresets.jsx
import React from "react";
import { Plus, X } from "lucide-react";

function DistancePresets({
  distance,
  setDistance,
  distancePresets,
  newPreset,
  setNewPreset,
  addPreset,
  removePreset,
  customDistance,
  setCustomDistance,
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        ランニング距離 (km)
      </label>
      <div className="flex flex-wrap gap-2 mb-4">
        {distancePresets.map((preset) => (
          <div key={preset} className="relative">
            <button
              onClick={() => {
                setDistance(preset);
                setCustomDistance("");
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                distance === preset && customDistance === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {preset} km
            </button>
            <button
              onClick={() => removePreset(preset)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              aria-label={`Remove ${preset}km preset`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={newPreset}
          onChange={(e) => setNewPreset(e.target.value)}
          placeholder="新しいプリセットを追加"
          className="flex-grow pl-3 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addPreset}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={customDistance}
          onChange={(e) => {
            setCustomDistance(e.target.value);
            setDistance(0); // customDistanceを優先するために既存distanceは0扱い
          }}
          placeholder="カスタム距離"
          className="pl-3 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

export default DistancePresets;
