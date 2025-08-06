import React from 'react';

/**
 * Dashboard Card Component
 * 
 * Reusable card component to display metrics with icons
 * 
 * @param {React.ReactNode} icon - Icon to display in the card
 * @param {string} title - Title of the metric
 * @param {string} value - Value of the metric
 * @param {string} bgColor - Background color class
 * @param {string} textColor - Text color class
 */
const DashboardCard = ({ icon, title, value, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;