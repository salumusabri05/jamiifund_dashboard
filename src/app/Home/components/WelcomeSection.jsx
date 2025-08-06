import React from 'react';

/**
 * Welcome Section Component
 * 
 * Displays a welcome message and brief description of the dashboard
 * Contained in a white card with purple accent text
 */
const WelcomeSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Welcome to JAMIIFUND Dashboard</h2>
      <p className="text-gray-600">
        Manage and monitor your JAMIIFUND activities from this central dashboard.
      </p>
    </div>
  );
};

export default WelcomeSection;