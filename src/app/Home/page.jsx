'use client';

import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
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

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Dashboard Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Welcome Message */}
        <WelcomeSection />

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