import React from 'react';

/**
 * Header Component
 * 
 * Displays the main header of the dashboard with the JAMIIFUND title
 * Uses purple background with white text for visibility
 */
const Header = () => {
  return (
    <header className="bg-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">JAMIIFUND Dashboard</h1>
      </div>
    </header>
  );
};

export default Header;