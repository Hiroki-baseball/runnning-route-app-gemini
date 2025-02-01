// // client/src/App.js
// import React, { useState,useEffect } from "react";
// import { LoadScript, GoogleMap, DirectionsRenderer,DirectionsService } from "@react-google-maps/api";

// import { MapPin, Navigation, Plus, X } from 'lucide-react'

// const initialDistancePresets = [3, 5, 10, 21.1, 42.2] // in km
// function App() {
//   const [origin, setOrigin] = useState("東京駅");
//   const [useCurrentLocation, setUseCurrentLocation] = useState(false);
//   const [destination, setDestination] = useState("秋葉原駅");
//   const [distance, setDistance] = useState(5);
//   const [routeData, setRouteData] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [directionsLoaded, setDirectionsLoaded] = useState(false);
//   const [isRequesting, setIsRequesting] = useState(false);
//   const [distancePresets, setDistancePresets] = useState(initialDistancePresets)
//   const [newPreset, setNewPreset] = useState('')
//   const [customDistance, setCustomDistance] = useState('')

//   // リクエスト開発用
//   // const handleGenerate = () => {
//   //   const finalDistance = customDistance ? parseFloat(customDistance) : distance
//   //   console.log('Generating course:', { origin, destination, distance: finalDistance })
//   // }



//   // 例：現在地から住所を取ってくる関数
// const reverseGeocode = (lat, lng) => {
//   return new Promise((resolve, reject) => {
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         resolve(results[0].formatted_address);
//       } else {
//         reject("逆ジオコーディングに失敗しました");
//       }
//     });
//   });
// };

// useEffect(() => {
//   if (useCurrentLocation) {
//     if (!navigator.geolocation) {
//       alert("Geolocationはこのブラウザでサポートされていません。");
//       setUseCurrentLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         try {
//           const address = await reverseGeocode(lat, lng);
//           setOrigin(address); // 住所をセット
//         } catch (e) {
//           console.error(e);
//           setOrigin(`${lat},${lng}`); // エラー時は lat,lng をセット
//         }
//       },
//       (error) => {
//         console.error("現在地を取得できませんでした: ", error);
//         alert("現在地を取得できませんでした。位置情報が許可されているか確認してください。");
//         setUseCurrentLocation(false);
//       }
//     );
//   }
// }, [useCurrentLocation]);

//   const addPreset = () => {
//     if (newPreset && !isNaN(parseFloat(newPreset))) {
//       setDistancePresets([...distancePresets, parseFloat(newPreset)])
//       setNewPreset('')
//     }
//   }

//   const removePreset = (preset) => {
//     setDistancePresets(distancePresets.filter(d => d !== preset))
//   }


//   // GoogleMap のコンテナスタイル
//   const containerStyle = {
//     width: "100%",
//     height: "500px",
//   };

//   // 地図のデフォルト中心 (東京駅付近)
//   const center = { lat: 35.681236, lng: 139.767125 };

  

//   useEffect(() => {
//     if (routeData && !directionsLoaded && !isRequesting) {
//       setDirections(null);
//     }
//   }, [routeData]);

//   const geocodeAddress = (address) => {
//     return new Promise((resolve, reject) => {
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ address }, (results, status) => {
//         if (status === 'OK') {
//           const { lat, lng } = results[0].geometry.location;
//           resolve({ lat: lat(), lng: lng() });
//         } else {
//           reject(`Geocode was not successful for the following reason: ${status}`);
//         }
//       });
//     });
//   };

//   const handleGenerateRoute = async () => {
//     console.log("[DEBUG] Sending data:", { origin, destination, distance }); // 送信データをログに記録
//     if (isRequesting) return; // 既にリクエスト中の場合は無視
//     setIsRequesting(true);
  
//     try {
//       setDirectionsLoaded(false);
//       setRouteData(null); // ルートデータをリセット
//       setDirections(null); // DirectionsRenderer のリセット

//       const originLatLng = await geocodeAddress(origin);
//       const destinationLatLng = await geocodeAddress(destination);
  
//       // 2. 緯度経度をサーバーに送信
//       const response = await fetch("http://localhost:3001/api/gemini-generate-route", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           origin: `${originLatLng.lat},${originLatLng.lng}`, // 緯度,経度の文字列にする
//           destination: `${destinationLatLng.lat},${destinationLatLng.lng}`,
//           distance,
//         }),
        
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Route data:", data);
//       setRouteData(data); // { waypoints: [...] }
//       setDirections(null); // ルートを再計算できるようリセット
//     } catch (error) {
//       console.error(error);
//       alert(`エラーが発生しました: ${error.message}`);
//     } finally {
//       setIsRequesting(false); // リクエスト完了後に有効化
//     }
//   };
  

//   // DirectionsService に渡すためのコールバック
// const handleDirectionsCallback = (res) => {
//   if (!res || directionsLoaded) return;

//   switch (res.status) {
//     case "OK":
//       setDirections(res);
//       setDirectionsLoaded(true);
//       break;
//     case "OVER_QUERY_LIMIT":
//       console.error("API quota exceeded.");
//       break;
//     default:
//       console.error("Directions request failed:", res);
//       break;
//   }
// };

//   let googleWaypoints = [];
//   let startLocation = center;
//   let endLocation = center;
//   let googleMapsShareUrl = "";

//   if (routeData && routeData.waypoints && routeData.waypoints.length >= 2) {
//     const fullWaypoints = routeData.waypoints;

//     startLocation = {
//       lat: fullWaypoints[0].latitude,
//       lng: fullWaypoints[0].longitude,
//     };
//     endLocation = {
//       lat: fullWaypoints[fullWaypoints.length - 1].latitude,
//       lng: fullWaypoints[fullWaypoints.length - 1].longitude,
//     };

//     // 中間地点を整形
//     googleWaypoints = fullWaypoints.slice(1, -1).map((wp) => ({
//       location: { lat: wp.latitude, lng: wp.longitude },
//       stopover: true,
//     }));
//     const waypointStrings = fullWaypoints.slice(1, -1).map(
//       (wp) => `${wp.latitude},${wp.longitude}`
//     );
//     googleMapsShareUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.lat},${startLocation.lng}&destination=${endLocation.lat},${endLocation.lng}&waypoints=${waypointStrings.join("|")}`;
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col text-gray-100">
//       {/* ヘッダー */}
//       <header className="bg-black shadow-md">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center">
//           <h1 className="text-2xl font-bold text-blue-400">マイラン</h1>
//         </div>
//       </header>

//       {/* メインコンテンツ */}
//       <main className="flex-grow container mx-auto px-4 py-8">
//         {/* 地図表示エリア */}
//         <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//           <div className="relative w-full h-[400px]">
//             {/* ルートが生成できたときのみ、Googleマップでルートを表示ボタン */}
//             {googleMapsShareUrl && (
//               <div className="absolute top-2 left-2 z-10">
//                 <a
//                   href={googleMapsShareUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Googleマップでルートを表示
//                 </a>
//               </div>
//             )}

//             {/* Google Map */}
//             <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={center}
//                 zoom={13}
//               >
//                 {/* ルートがあるときだけ DirectionsService を呼び出し */}
//                 {routeData && routeData.waypoints && !directionsLoaded && !isRequesting && (
//                   <DirectionsService
//                     options={{
//                       origin: {
//                         lat: routeData.waypoints[0].latitude,
//                         lng: routeData.waypoints[0].longitude,
//                       },
//                       destination: {
//                         lat: routeData.waypoints[routeData.waypoints.length - 1].latitude,
//                         lng: routeData.waypoints[routeData.waypoints.length - 1].longitude,
//                       },
//                       waypoints: routeData.waypoints.slice(1, -1).map((wp) => ({
//                         location: { lat: wp.latitude, lng: wp.longitude },
//                         stopover: true,
//                       })),
//                       travelMode: "WALKING",
//                     }}
//                     callback={handleDirectionsCallback}
//                   />
//                 )}
//                 {/* DirectionsRenderer はルートを描画 */}
//                 {directions && 
//                 <DirectionsRenderer 
//                 directions={directions} />}
//               </GoogleMap>
//             </LoadScript>
//           </div>
//         </div>

//         {/* 入力フォーム周辺 */}
//         <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             {/* スタート地点 */}
//             <div>
//               <label
//                 htmlFor="start-point"
//                 className="block text-sm font-medium text-gray-300 mb-2"
//               >
//                 出発地点
//               </label>
//               <div className="relative">
//                 <MapPin 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
//                   size={20} 
//                 />
//                 <input
//                   type="text"
//                   id="start-point"
//                   value={origin}
//                   onChange={(e) => setOrigin(e.target.value)}
//                   className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="出発地点を入力"
//                 />
//               {/* 現在地を使用 チェックボックス */}
//               <div className="mt-3 flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="use-current-location"
//                   checked={useCurrentLocation}
//                   onChange={(e) => setUseCurrentLocation(e.target.checked)}
//                   className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="use-current-location" className="text-sm text-gray-300">
//                   現在地を使用
//                 </label>
//               </div>
//             </div>
//           </div>
//             {/* ゴール地点 */}
//             <div>
//               <label
//                 htmlFor="end-point"
//                 className="block text-sm font-medium text-gray-300 mb-2"
//               >
//                 目的地
//               </label>
//               <div className="relative">
//                 <Navigation 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
//                   size={20} 
//                 />
//                 <input
//                   type="text"
//                   id="end-point"
//                   value={destination}
//                   onChange={(e) => setDestination(e.target.value)}
//                   className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="目的地を入力"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* 距離プリセット & カスタム距離 */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//             ランニング距離 (km)
//             </label>
//             <div className="flex flex-wrap gap-2 mb-4">
//               {distancePresets.map((preset) => (
//                 <div key={preset} className="relative">
//                   <button
//                     onClick={() => {
//                       setDistance(preset);
//                       setCustomDistance('');
//                     }}
//                     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                       distance === preset && customDistance === ''
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     {preset} km
//                   </button>
//                   <button
//                     onClick={() => removePreset(preset)}
//                     className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
//                     aria-label={`Remove ${preset}km preset`}
//                   >
//                     <X size={12} />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-2 mb-4">
//               <input
//                 type="number"
//                 value={newPreset}
//                 onChange={(e) => setNewPreset(e.target.value)}
//                 placeholder="新しいプリセットを追加"
//                 className="flex-grow pl-3 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 onClick={addPreset}
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
//               >
//                 <Plus size={20} />
//               </button>
//             </div>
//           </div>

//           {/* 生成ボタン */}
//           <button
//             onClick={handleGenerateRoute}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//             disabled={isRequesting}>
//             {isRequesting ? '処理中...' : 'コース自動生成'}
//           </button>
//         </div>
//       </main>

//       {/* フッター */}
//       <footer className="bg-black mt-8">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
//           <p className="text-center text-sm text-gray-500">
//             © {new Date().getFullYear()} RunCourse Generator. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;