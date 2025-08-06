
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import supabase from '../../lib/supabaseClient';
import { FiChevronDown, FiSearch, FiDownload, FiUser, FiDollarSign } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Funds & Reports Page
 * 
 * Displays financial data, user profiles, and user summaries
 * Features:
 * - Total funds raised overview
 * - Campaign-specific financial data
 * - User donation summaries
 * - Export functionality for reports
 */
const FundsPage = () => {
  const [fundsData, setFundsData] = useState([]);
  const [campaignFunds, setCampaignFunds] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    fetchFundsData();
  }, []);

  const fetchFundsData = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch from Supabase tables
      // For now, we'll use sample data
      setTimeout(() => {
        // Generate monthly data for the past year
        const monthlyData = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthlyData.push({
            name: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            amount: Math.floor(Math.random() * 40000) + 10000
          });
        }
        setFundsData(monthlyData);
        
        // Sample campaign funds data
        setCampaignFunds([
          { id: 1, title: 'Clean Water Initiative', target: 50000, raised: 42500, donors: 142, status: 'active' },
          { id: 2, title: 'Education for All', target: 30000, raised: 30000, donors: 98, status: 'completed' },
          { id: 3, title: 'Medical Support Fund', target: 75000, raised: 25000, donors: 64, status: 'active' },
          { id: 4, title: 'Community Center Build', target: 120000, raised: 85000, donors: 210, status: 'active' },
        ]);
        
        // Sample top donors
        setTopDonors([
          { id: 1, name: 'John Smith', email: 'john.smith@example.com', total: 5200, campaigns: 4, latest: '2023-07-15' },
          { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', total: 4750, campaigns: 3, latest: '2023-08-02' },
          { id: 3, name: 'Michael Wong', email: 'm.wong@example.com', total: 3600, campaigns: 2, latest: '2023-08-10' },
          { id: 4, name: 'Lisa Chen', email: 'lisa.chen@example.com', total: 2800, campaigns: 5, latest: '2023-07-28' },
          { id: 5, name: 'Robert Davis', email: 'rob.davis@example.com', total: 2500, campaigns: 2, latest: '2023-08-05' },
        ]);
        
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching funds data:', error);
      setLoading(false);
    }
  };

  const getTotalFunds = () => {
    return fundsData.reduce((sum, item) => sum + item.amount, 0);
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
    <AdminLayout currentPage="Funds & Reports">
      <motion.div 
        className="mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tabs */}
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap"
          variants={itemVariants}
        >
          <button 
            className={`mr-4 pb-2 ${activeTab === 'overview' ? 'border-b-2 border-purple-600 text-purple-800 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Funds Overview
          </button>
          <button 
            className={`mr-4 pb-2 ${activeTab === 'campaigns' ? 'border-b-2 border-purple-600 text-purple-800 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('campaigns')}
          >
            Campaign Funds
          </button>
          <button 
            className={`mr-4 pb-2 ${activeTab === 'donors' ? 'border-b-2 border-purple-600 text-purple-800 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('donors')}
          >
            User Summaries
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Funds Overview */}
            {activeTab === 'overview' && (
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Funds Raised</h3>
                    <p className="text-3xl font-bold text-purple-800">
                      ${getTotalFunds().toLocaleString()}
                    </p>
                    <div className="text-sm text-green-600 mt-2">+18.2% from last year</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Active Campaigns</h3>
                    <p className="text-3xl font-bold text-purple-800">
                      {campaignFunds.filter(c => c.status === 'active').length}
                    </p>
                    <div className="text-sm text-gray-500 mt-2">
                      Total: {campaignFunds.length} campaigns
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Donors</h3>
                    <p className="text-3xl font-bold text-purple-800">
                      {campaignFunds.reduce((sum, c) => sum + c.donors, 0)}
                    </p>
                    <div className="text-sm text-green-600 mt-2">+24.5% from last year</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-purple-800">Funds Raised (12 Months)</h3>
                    <motion.button
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md flex items-center text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiDownload className="mr-2" />
                      Export Data
                    </motion.button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fundsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          name="Funds Raised" 
                          stroke="#8b5cf6" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Campaign Funds */}
            {activeTab === 'campaigns' && (
              <motion.div variants={itemVariants}>
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-purple-800">Campaign Funds</h3>
                    <motion.button
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md flex items-center text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiDownload className="mr-2" />
                      Export Report
                    </motion.button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donors</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {campaignFunds.map(campaign => (
                          <tr key={campaign.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-800">{campaign.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${campaign.target.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${campaign.raised.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-purple-600 h-2.5 rounded-full" 
                                  style={{ width: `${Math.min(100, (campaign.raised / campaign.target) * 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {Math.round((campaign.raised / campaign.target) * 100)}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.donors}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* User Summaries */}
            {activeTab === 'donors' && (
              <motion.div variants={itemVariants}>
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-purple-800">Top Donors</h3>
                    <div className="flex items-center">
                      <div className="relative mr-2">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search donors"
                          className="pl-10 pr-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <motion.button
                        className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md flex items-center text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiDownload className="mr-2" />
                        Export
                      </motion.button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Donation</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaigns</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Donation</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topDonors
                          .filter(donor => 
                            donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            donor.email.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(donor => (
                            <tr key={donor.id} className="hover:bg-purple-50 cursor-pointer" onClick={() => setSelectedUser(donor)}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <FiUser className="text-purple-600" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                                    <div className="text-sm text-gray-500">{donor.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">${donor.total.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.campaigns}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(donor.latest).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                                <button className="hover:text-purple-800">View Details</button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* User Profile Modal */}
      {selectedUser && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedUser(null)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800">Donor Profile</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedUser(null)}
                >
                  <FiChevronDown size={24} />
                </button>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <FiUser size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <FiDollarSign className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Donations</p>
                      <p className="text-xl font-bold text-purple-800">${selectedUser.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <FiDollarSign className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Campaigns Supported</p>
                      <p className="text-xl font-bold text-purple-800">{selectedUser.campaigns}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Recent Donations</h3>
                <div className="space-y-3">
                  {/* Dummy data - in a real app, you'd fetch this from your database */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Clean Water Initiative</p>
                      <p className="text-sm text-gray-500">{new Date(selectedUser.latest).toLocaleDateString()}</p>
                    </div>
                    <p className="font-semibold">${(selectedUser.total * 0.4).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Education for All</p>
                      <p className="text-sm text-gray-500">
                        {new Date(new Date(selectedUser.latest).setDate(new Date(selectedUser.latest).getDate() - 14)).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold">${(selectedUser.total * 0.3).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Medical Support Fund</p>
                      <p className="text-sm text-gray-500">
                        {new Date(new Date(selectedUser.latest).setDate(new Date(selectedUser.latest).getDate() - 30)).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold">${(selectedUser.total * 0.3).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default FundsPage;