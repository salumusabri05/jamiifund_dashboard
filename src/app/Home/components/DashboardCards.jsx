import React from 'react';
import { FiUsers, FiDollarSign, FiPieChart, FiSettings } from 'react-icons/fi';
import DashboardCard from './DashboardCard';

/**
 * Dashboard Cards Container Component
 * 
 * Displays a grid of metric cards showing key performance indicators
 * Data is fetched from Supabase
 * 
 * @param {Object} userData - User statistics from Supabase
 * @param {Object} revenueData - Revenue statistics from Supabase
 * @param {Object} investmentsData - Investment statistics from Supabase
 * @param {boolean} loading - Loading state while data is being fetched
 */
const DashboardCards = ({ userData, revenueData, investmentsData, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <DashboardCard 
        icon={<FiUsers className="h-8 w-8" />}
        title="Users"
        value={loading ? "Loading..." : userData.count.toLocaleString()}
        bgColor="bg-purple-100"
        textColor="text-purple-700"
      />
      <DashboardCard 
        icon={<FiDollarSign className="h-8 w-8" />}
        title="Revenue"
        value={loading ? "Loading..." : `$${revenueData.total.toLocaleString()}`}
        bgColor="bg-purple-100"
        textColor="text-purple-700"
      />
      <DashboardCard 
        icon={<FiPieChart className="h-8 w-8" />}
        title="Investments"
        value={loading ? "Loading..." : investmentsData.count.toLocaleString()}
        bgColor="bg-purple-100"
        textColor="text-purple-700"
      />
      <DashboardCard 
        icon={<FiSettings className="h-8 w-8" />}
        title="Settings"
        value="7 updates"
        bgColor="bg-purple-100"
        textColor="text-purple-700"
      />
    </div>
  );
};

export default DashboardCards;