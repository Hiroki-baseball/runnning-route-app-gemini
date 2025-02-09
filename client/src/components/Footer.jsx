// client/src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-white mt-8">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} 走ルンRUN. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


export default Footer;
