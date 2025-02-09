// client/src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage に保存しているトークンを削除
    localStorage.removeItem('token');
    // 必要に応じて、他の認証情報やユーザー情報もクリアする
    // 例: localStorage.removeItem('user');
    
    // ログインページへリダイレクト
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
    >
      ログアウト
    </button>
  );
};

export default LogoutButton;