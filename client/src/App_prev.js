// // client/src/App.js
// import React, { useState,useEffect } from "react";
// import { LoadScript, GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

// // DirectionsService を使う場合は以下もインポート
// import { DirectionsService } from "@react-google-maps/api";

// function App() {
//   const [origin, setOrigin] = useState("東京駅");
//   const [destination, setDestination] = useState("秋葉原駅");
//   const [distance, setDistance] = useState(5);
//   const [routeData, setRouteData] = useState(null);

//   const [directions, setDirections] = useState(null);
//   const [directionsLoaded, setDirectionsLoaded] = useState(false);
//   const [isRequesting, setIsRequesting] = useState(false);

//   // GoogleMap のコンテナスタイル
//   const containerStyle = {
//     width: "100%",
//     height: "500px",
//   };

//   // 地図のデフォルト中心 (東京駅付近)
//   const center = { lat: 35.681236, lng: 139.767125 };

//   useEffect(() => {
//     return () => {
//       setDirectionsLoaded(false);
//     };
//   }, []);

//   // ルート作成ボタン押下時
//   const handleGenerateRoute = async () => {
//     console.log("[DEBUG] Sending data:", { origin, destination, distance }); // 送信データをログに記録
//     if (isRequesting) return; // 既にリクエスト中の場合は無視
//     setIsRequesting(true);

//     try {
//       const response = await fetch("http://localhost:3001/api/chatgpt-generate-route", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ origin, destination, distance }),
//       });
//       // if (!response.ok) {
//       //   const errorText = await response.text(); // サーバーからのエラーメッセージを取得
//       //   throw new Error("サーバーエラー");
//       // }
//       const data = await response.json();
//       console.log("[DEBUG] Received data:", data); // サーバーからのデータをログに記録
//       setRouteData(data); // { waypoints: [...] }
//       setDirections(null); // ルートを再計算できるようリセット
//     } catch (error) {
//       console.error(error);
//       alert("ルート生成に失敗しました。");
//     } finally {
//     setIsRequesting(false); // リクエスト完了後に有効化
//   }
//   };

//   // DirectionsService に渡すためのコールバック
//   const handleDirectionsCallback = (res) => {
//     if (res !== null && !directionsLoaded) {
//       if (res.status === "OK") {
//         setDirections(res);
//         setDirectionsLoaded(true); // 一度だけDirectionsをロード
//       } else {
//         console.log("Directions request failed:", res);
//       }
//     }
//   };

//   // ChatGPT から受け取った waypoints を DirectionsService 用に整形
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
//       (wp) => ${wp.latitude},${wp.longitude}
//     );
//     googleMapsShareUrl = https://www.google.com/maps/dir/?api=1&origin=${startLocation.lat},${startLocation.lng}&destination=${endLocation.lat},${endLocation.lng}&waypoints=${waypointStrings.join("|")};
//   }

//   return (
//     <div>
//       <h1>ランニングルート作成</h1>
//       <div>
//         <label>
//           出発地:
//           <input value={origin} onChange={(e) => setOrigin(e.target.value)} />
//         </label>
//         <br />
//         <label>
//           目的地:
//           <input
//             value={destination}
//             onChange={(e) => setDestination(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           距離(km):
//           <input
//             type="number"
//             value={distance}
//             onChange={(e) => setDistance(Number(e.target.value))} // 数値に変換
//           />
//         </label>
//         <br />
//         <button onClick={handleGenerateRoute}>ルート作成</button>
//         {googleMapsShareUrl && (
//           <div style={{ marginTop: "20px" }}>
//             <a href={googleMapsShareUrl} target="_blank" rel="noopener noreferrer">
//               Googleマップでルートを表示
//             </a>
//           </div>
//         )}
//       </div>

//       <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={startLocation} // 出発地点を中心に
//           zoom={13}
//         >
//           {/* DirectionsService: routeData がある場合のみ描画 */}
//           {routeData && !directionsLoaded && (
//             <DirectionsService
//               options={{
//                 origin: startLocation,
//                 destination: endLocation,
//                 waypoints: googleWaypoints,
//                 travelMode: "WALKING",
//               }}
//               callback={handleDirectionsCallback}
//             />
//           )}

//           {/* DirectionsRenderer: directions の結果が取れたら描画 */}
//           {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// }

// export default App;