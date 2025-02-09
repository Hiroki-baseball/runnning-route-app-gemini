// client/src/components/Header.jsx
import React from "react";
import logo from "../assets/HashiRUNRUN_LOGO.webp";
import LogoutButton from "./LogoutButton";

function Header() {
  return (
    <header className="bg-gray-200 shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center">
        {/* 左側（空） */}
        <div></div>
        {/* 中央：ロゴとタイトル */}
        <div className="flex items-center justify-center">
          <img src={logo} alt="ロゴ" className="h-10 w-auto mr-3" />
          <h1 className="text-2xl font-bold text-blue-900">走ルンRUN</h1>
        </div>
        {/* 右側：ログアウトボタン */}
        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

export default Header;