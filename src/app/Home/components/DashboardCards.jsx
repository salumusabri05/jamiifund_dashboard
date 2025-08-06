import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFlag, FiDollarSign, FiRepeat } from 'react-icons/fi';

const DashboardCards = ({ stats, loading }) => {
  // Safe default values for stats
  const safeStats = {
    users: stats?.users || 0,
    campaigns: stats?.campaigns || 0,
    funds: stats?.funds || 0,
    transactions: stats?.transactions || 0
  };

  // Card data with safe values
  const cards = [
    {
      title: 'Total Users',
      value: safeStats.users,
      icon: <FiUsers size={24} />,
      color: 'bg-blue-500',
      increase: '+12%',
    },
    {
      title: 'Active Campaigns',
      value: safeStats.campaigns,
      icon: <FiFlag size={24} />,
      color: 'bg-green-500',
      increase: '+5%',
    },
    {
      title: 'Total Funds Raised',
      value: `$${safeStats.funds.toLocaleString()}`,
      icon: <FiDollarSign size={24} />,
      color: 'bg-purple-500',
      increase: '+18%',
    },
    {
      title: 'Transactions',
      value: safeStats.transactions,
      icon: <FiRepeat size={24} />,
      color: 'bg-orange-500',
      increase: '+7%',
    },
  ];

  // Animation settings
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {loading ? (
        // Loading skeleton for cards
        Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))
      ) : (
        // Actual data cards
        cards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            variants={item}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">{card.title}</h3>
                <div className={`${card.color} text-white p-2 rounded-full`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
              <p className="text-sm text-green-600 flex items-center">
                {card.increase}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V3.414l-9.293 9.293a1 1 0 01-1.414-1.414l9.293-9.293H7a1 1 0 010-2h6a1 1 0 011 1v6a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500 ml-1">since last month</span>
              </p>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default DashboardCards;