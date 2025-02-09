import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from "./components/Header";
import Footer from "./components/Footer";
import RoutePlanner from "./pages/RoutePlanner";
import Login from './pages/Login';
import Register from './pages/Register'; // 登録用コンポーネントのインポート
import PrivateRoute from './components/PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
    <Header />
    <Routes>
      {/* ログインページ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* メインのルートプランナーは認証が必要 */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <RoutePlanner />
          </PrivateRoute>
        }
      />
    </Routes>
    <Footer />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
