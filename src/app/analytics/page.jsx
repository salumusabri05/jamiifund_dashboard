'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import supabase from '../../lib/supabaseClient';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FiCalendar } from 'react-icons/fi';

/**
 * Web Analytics Page
 * 
 * Displays important metrics and analytics data
 * Features:
 * - Interactive charts and graphs
 * - Date range filtering
 * - Key performance indicators
 */
const AnalyticsPage = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  
  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch from Supabase tables
      // Simulating API fetch with dummy data
      setTimeout(() => {
        // Generate data based on date range
        let days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365;
        let labelFormat = dateRange === 'year' ? 'MMM' : 'D MMM';
        
        // Visitor data
        const visitorSeries = generateTimeSeriesData(days, 100, 500);
        setVisitorData(visitorSeries);
        
        // Page view data
        const pageViewSeries = [
          { name: 'Home', value: Math.floor(Math.random() * 5000) + 2000 },
          { name: 'Campaigns', value: Math.floor(Math.random() * 4000) + 1000 },
          { name: 'Donate', value: Math.floor(Math.random() * 3000) + 1000 },
          { name: 'About', value: Math.floor(Math.random() * 2000) + 500 },
        ];
        setPageViews(pageViewSeries);
        
        // Conversion data
        const conversionSeries = [
          { name: 'Visitors', value: Math.floor(Math.random() * 5000) + 10000 },
          { name: 'Registrations', value: Math.floor(Math.random() * 2000) + 2000 },
          { name: 'Donations', value: Math.floor(Math.random() * 1000) + 1000 },
        ];
        setConversionData(conversionSeries);
        
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };
  
  // Helper function to generate time series data
  const generateTimeSeriesData = (days, min, max) => {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * (max - min + 1)) + min
      });
    }
    
    return data;
  };

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

  return (
    <AdminLayout currentPage="Web Analytics">
      <motion.div 
        className="mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Date Range Filter */}
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-purple-800">Analytics Dashboard</h2>
          <div className="flex items-center border-2 border-purple-200 rounded-md">
            <FiCalendar className="text-gray-400 ml-3" />
            <select
              className="outline-none bg-transparent py-2 px-3"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last 365 days</option>
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
              variants={itemVariants}
            >
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Visitors</h3>
                <p className="text-3xl font-bold text-purple-800">
                  {visitorData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </p>
                <div className="text-sm text-green-600 mt-2">+12.5% from last {dateRange}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold text-purple-800">4.8%</p>
                <div className="text-sm text-green-600 mt-2">+0.6% from last {dateRange}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Session Time</h3>
                <p className="text-3xl font-bold text-purple-800">3:42</p>
                <div className="text-sm text-red-600 mt-2">-0:12 from last {dateRange}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Bounce Rate</h3>
                <p className="text-3xl font-bold text-purple-800">32.4%</p>
                <div className="text-sm text-green-600 mt-2">-2.1% from last {dateRange}</div>
              </div>
            </motion.div>

            {/* Visitor Traffic Chart */}
            <motion.div 
              className="bg-white p-4 rounded-lg shadow-md mb-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Visitor Traffic</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      name="Visitors" 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Charts Row */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
              variants={itemVariants}
            >
              {/* Page Views Chart */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Popular Pages</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pageViews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Page Views" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">User Engagement</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conversionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AnalyticsPage;