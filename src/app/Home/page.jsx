'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFlag, FiEdit, FiBarChart2, FiDollarSign } from 'react-icons/fi';
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

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // These are example queries - adjust according to your actual database schema
        const [usersResponse, campaignsResponse, fundsResponse, transactionsResponse, activitiesResponse] = 
          await Promise.allSettled([
            supabase.from('users').select('id', { count: 'exact' }),
            supabase.from('campaigns').select('id', { count: 'exact' }),
            supabase.from('transactions').select('amount').eq('status', 'completed'),
            supabase.from('transactions').select('id', { count: 'exact' }),
            supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(5)
          ]);

        // Update stats with results
        setStats({
          users: usersResponse.status === 'fulfilled' ? usersResponse.value.count || 0 : 0,
          campaigns: campaignsResponse.status === 'fulfilled' ? campaignsResponse.value.count || 0 : 0,
          funds: fundsResponse.status === 'fulfilled' 
            ? fundsResponse.value.data?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0 
            : 0,
          transactions: transactionsResponse.status === 'fulfilled' ? transactionsResponse.value.count || 0 : 0
        });

        // Set activities
        if (activitiesResponse.status === 'fulfilled' && activitiesResponse.value.data) {
          setActivities(activitiesResponse.value.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if supabase client exists
    if (supabase) {
      fetchStats();
    } else {
      setLoading(false);
    }
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