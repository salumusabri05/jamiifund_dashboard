'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import DashboardCards from './components/DashboardCards';
import RecentActivity from './components/RecentActivity';
import { supabase } from '../../lib/supabaseClient';

/**
 * Main HomePage Component
 * 
 * Serves as the container for all dashboard components
 * Uses a purple-themed color scheme with responsive layout
 * Connects to Supabase for data fetching
 */
const HomePage = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    campaigns: 0,
    funds: 0,
    transactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }
        
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (usersError) throw usersError;
        
        // Fetch campaigns count
        const { count: campaignsCount, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true });
        
        if (campaignsError) throw campaignsError;
        
        // Fetch funds total
        const { data: fundsData, error: fundsError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('status', 'completed');
        
        if (fundsError) throw fundsError;
        
        // Calculate total funds
        const totalFunds = fundsData?.reduce((sum, item) => 
          sum + (parseFloat(item.amount) || 0), 0) || 0;
        
        // Fetch transactions count
        const { count: transactionsCount, error: transactionsError } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true });
        
        if (transactionsError) throw transactionsError;
        
        // Fetch recent activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (activitiesError) throw activitiesError;
        
        // Update state with fetched data
        setStats({
          users: usersCount || 0,
          campaigns: campaignsCount || 0,
          funds: totalFunds,
          transactions: transactionsCount || 0
        });
        
        setActivities(activitiesData || []);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Content to render inside AdminLayout
  const dashboardContent = (
    <>
      {/* Welcome Section */}
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-purple-800 mb-2">
          Welcome back, {admin?.full_name || 'Admin'}
        </h2>
        <p className="text-gray-600">
          Manage fundraising campaigns, verify users, and monitor platform performance from this central dashboard.
        </p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-medium">Error loading dashboard data:</p>
            <p>{error}</p>
          </div>
        )}
      </motion.div>

      {/* Dashboard Cards */}
      <DashboardCards stats={stats} loading={loading} />

      {/* Recent Activity */}
      <RecentActivity activities={activities} loading={loading} />
    </>
  );

  return (
    <AdminLayout currentPage="Dashboard">
      {dashboardContent}
    </AdminLayout>
  );
};

export default HomePage;