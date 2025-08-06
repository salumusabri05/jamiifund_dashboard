'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiFlag, FiEdit, FiBarChart2, FiDollarSign } from 'react-icons/fi';
import Link from 'next/link';
import DashboardCards from './components/DashboardCards';
import RecentActivity from './components/RecentActivity';
import supabase from '../../lib/supabaseClient';

/**
 * Main HomePage Component
 * 
 * Serves as the container for all dashboard components
 * Uses a purple-themed color scheme with responsive layout
 * Connects to Supabase for data fetching
 */
const HomePage = () => {
  // State to store data from Supabase
  const [userData, setUserData] = useState({ count: 0 });
  const [revenueData, setRevenueData] = useState({ total: 0 });
  const [investmentsData, setInvestmentsData] = useState({ count: 0 });
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data from Supabase
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Example: Fetch user count
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true });
        
        if (usersError) throw usersError;
        
        // Example: Fetch revenue data
        const { data: revenue, error: revenueError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'revenue');
        
        if (revenueError) throw revenueError;
        
        // Example: Fetch investments count
        const { data: investments, error: investmentsError } = await supabase
          .from('investments')
          .select('id', { count: 'exact', head: true });
        
        if (investmentsError) throw investmentsError;
        
        // Example: Fetch recent activity
        const { data: activities, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (activitiesError) throw activitiesError;
        
        // Update state with fetched data
        setUserData({ count: users.length });
        setRevenueData({ 
          total: revenue.reduce((sum, item) => sum + item.amount, 0) 
        });
        setInvestmentsData({ count: investments.length });
        setActivityData(activities || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Menu items for dashboard features
  const menuItems = [
    { icon: <FiUsers size={40} />, title: 'Verify Users', description: 'Review and approve user registrations', path: '/verify-users', color: 'bg-blue-100 text-blue-600' },
    { icon: <FiFlag size={40} />, title: 'Verify Campaigns', description: 'Validate new fundraising campaigns', path: '/verify-campaigns', color: 'bg-green-100 text-green-600' },
    { icon: <FiEdit size={40} />, title: 'Manage Campaigns', description: 'Update or remove existing campaigns', path: '/manage-campaigns', color: 'bg-yellow-100 text-yellow-600' },
    { icon: <FiEdit size={40} />, title: 'Blog Management', description: 'Create and publish blog content', path: '/blog-management', color: 'bg-pink-100 text-pink-600' },
    { icon: <FiBarChart2 size={40} />, title: 'Analytics', description: 'View website performance metrics', path: '/analytics', color: 'bg-indigo-100 text-indigo-600' },
    { icon: <FiDollarSign size={40} />, title: 'Funds & Reports', description: 'Track donations and generate reports', path: '/funds', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <motion.header 
        className="bg-purple-600 text-white p-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">JAMIIFUND Dashboard</h1>
          <p className="mt-2 text-purple-200">Admin Control Panel</p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Welcome Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-purple-800 mb-2">Welcome to JAMIIFUND Admin Dashboard</h2>
          <p className="text-gray-600">
            Manage fundraising campaigns, verify users, and monitor platform performance from this central dashboard.
            Select any of the modules below to get started.
          </p>
        </motion.div>

        {/* Dashboard Modules */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item, index) => (
            <Link href={item.path} key={index}>
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="p-6">
                  <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="bg-purple-50 p-4">
                  <p className="text-purple-600 font-medium flex items-center">
                    Access Module
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Dashboard Metrics */}
        <DashboardCards 
          userData={userData}
          revenueData={revenueData}
          investmentsData={investmentsData}
          loading={loading}
        />

        {/* Recent User Activity */}
        <RecentActivity 
          activities={activityData}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default HomePage;