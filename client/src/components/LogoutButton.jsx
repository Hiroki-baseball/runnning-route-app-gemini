// client/src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    
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