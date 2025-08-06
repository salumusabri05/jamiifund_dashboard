'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import supabase from '../../lib/supabaseClient';
import { FiCheckCircle, FiXCircle, FiSearch, FiInfo } from 'react-icons/fi';

/**
 * Verify Campaigns Page
 * 
 * Admin interface for verifying fundraising campaigns
 * Features:
 * - Filtering campaigns by status and search term
 * - Detailed campaign view with images and description
 * - Approval or rejection with comments
 */
const VerifyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const fetchPendingCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*, user:users(full_name, email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignStatus = async (campaignId, status) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ 
          status: status,
          admin_note: adminNote,
          verified_at: new Date().toISOString()
        })
        .eq('id', campaignId);
      
      if (error) throw error;
      
      // Refresh the campaign list
      fetchPendingCampaigns();
      setSelectedCampaign(null);
      setAdminNote('');
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AdminLayout currentPage="Verify Campaigns">
      <div className="mb-6">
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-md mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center border-2 border-purple-200 rounded-md px-3 py-2">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search campaigns by title or description"
              className="flex-1 outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map(campaign => (
                <motion.div
                  key={campaign.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  {campaign.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={campaign.image_url} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">{campaign.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{campaign.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">Goal: </span>
                        <span className="font-medium">${campaign.goal_amount?.toLocaleString()}</span>
                      </div>
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Pending Verification
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Created by: {campaign.user?.full_name || 'Unknown user'}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No pending campaigns found to verify.
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCampaign(null)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            {selectedCampaign.image_url && (
              <div className="h-64 overflow-hidden">
                <img 
                  src={selectedCampaign.image_url} 
                  alt={selectedCampaign.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">{selectedCampaign.title}</h2>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>Created by: {selectedCampaign.user?.full_name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(selectedCampaign.created_at).toLocaleDateString()}</span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Campaign Details</h3>
                <p className="text-gray-700 mb-4">{selectedCampaign.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Goal Amount</p>
                    <p className="font-bold text-purple-800">${selectedCampaign.goal_amount?.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Campaign Duration</p>
                    <p className="font-bold text-purple-800">
                      {selectedCampaign.end_date ? 
                        `Until ${new Date(selectedCampaign.end_date).toLocaleDateString()}` : 
                        'Ongoing'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Admin Notes</h3>
                <textarea
                  className="w-full border-2 border-purple-200 rounded-md p-3 h-24"
                  placeholder="Add notes or reasons for approval/rejection..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
                <motion.button
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateCampaignStatus(selectedCampaign.id, 'rejected')}
                >
                  <FiXCircle className="mr-2" />
                  Reject Campaign
                </motion.button>
                <motion.button
                  className="bg-green-100 text-green-600 px-4 py-2 rounded-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateCampaignStatus(selectedCampaign.id, 'approved')}
                >
                  <FiCheckCircle className="mr-2" />
                  Approve Campaign
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default VerifyCampaignsPage;